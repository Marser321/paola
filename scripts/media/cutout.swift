// Recorta el sujeto de una foto usando Vision (VNGenerateForegroundInstanceMask).
// uso: cutout <entrada.png> <salida.png>
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("uso: cutout <in> <out>\n".data(using: .utf8)!)
    exit(2)
}
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
    pixelBuffer = try observation.generateMaskedImage(
        ofInstances: observation.allInstances,
        from: handler,
        croppedToInstancesExtent: false
    )
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
