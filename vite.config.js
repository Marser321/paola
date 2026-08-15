import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: './', // build portable (Netlify/Vercel/GitHub Pages)
  build: {
    target: 'es2020',
    // El único chunk que supera los 500 kB es `three`, y es deliberado: se carga
    // con import() dinámico y nunca entra en el arranque. Sin subir el umbral, el
    // build avisaría en cada ejecución de algo que ya está resuelto por diseño.
    // El budget que importa es el del JS INICIAL (<150 kB gzip, tarea 17 §6).
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      // MPA (tarea 29): index.html + caso.html. Una plantilla de caso, no seis.
      input: {
        main: resolve(__dirname, 'index.html'),
        caso: resolve(__dirname, 'caso.html'),
        avisoLegal: resolve(__dirname, 'legal/aviso-legal.html'),
        privacidad: resolve(__dirname, 'legal/privacidad.html'),
        cookies: resolve(__dirname, 'legal/cookies.html'),
      },
      output: {
        // Vendors separados (tarea 17). `three` NO se lista aquí: sale solo en su
        // propio chunk porque hero-scene.js lo carga con import() dinámico.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('gsap')) return 'vendor-gsap'
          if (id.includes('lenis')) return 'vendor-lenis'
        },
      },
    },
  },
})
