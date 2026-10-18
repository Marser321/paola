// Recorta el sujeto de una foto usando Vision (VNGenerateForegroundInstanceMask).
//
// uso: cutout <entrada.png> <salida.png> [--mask]
//
// SIN --mask hace lo de siempre: devuelve la imagen ya enmascarada.
//
// CON --mask escribe solo el ALFA, en gris y a la resolución del original.
// Esa es la vía buena y el motivo es concreto: `generateMaskedImage` aplica la
// máscara en duro a la resolución a la que Vision la calcula (bastante menor que
// la foto) y el resultado sale ESCALONADO EN BLOQUES, sin un solo píxel de
// antialias y con el pelo convertido en un casco macizo. Se ve sobre todo en
// tema claro, donde el contorno va contra el papel crema.
//
// `generateScaledMaskForImage` en cambio devuelve la máscara SUAVE reescalada al
// tamaño de la entrada, y deja el RGB original intacto para poder descontaminar
// el borde después (scripts/media/build-media.py). Con el alfa aparte se puede
// suavizar, erosionar y sangrar color sin tocar la foto.
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("uso: cutout <in> <out> [--mask]\n".data(using: .utf8)!)
    exit(2)
}
let wantsMask = args.contains("--mask")
let inURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])

guard let ciImage = CIImage(contentsOf: inURL) else {
    FileHandle.standardError.write("no se pudo leer \(args[1])\n".data(using: .utf8)!)
    exit(1)
}

let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()

do {
    try handler.perform([request])
} catch {
    FileHandle.standardError.write("vision fallo: \(error)\n".data(using: .utf8)!)
    exit(1)
}

guard let observation = request.results?.first else {
    FileHandle.standardError.write("sin sujeto detectado\n".data(using: .utf8)!)
    exit(1)
}

// allInstances = todas las instancias de primer plano detectadas.
let pixelBuffer: CVPixelBuffer
do {
    if wantsMask {
        // Máscara suave, ya reescalada al tamaño de la entrada.
        pixelBuffer = try observation.generateScaledMaskForImage(
            forInstances: observation.allInstances,
            from: handler
        )
    } else {
        pixelBuffer = try observation.generateMaskedImage(
            ofInstances: observation.allInstances,
            from: handler,
            croppedToInstancesExtent: false
        )
    }
} catch {
    FileHandle.standardError.write("mascara fallo: \(error)\n".data(using: .utf8)!)
    exit(1)
}

let masked = CIImage(cvPixelBuffer: pixelBuffer)
let ctx = CIContext()
guard let png = ctx.pngRepresentation(
    of: masked,
    format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!
) else {
    FileHandle.standardError.write("no se pudo codificar png\n".data(using: .utf8)!)
    exit(1)
}
try png.write(to: outURL)
print("ok \(Int(masked.extent.width))x\(Int(masked.extent.height))")
