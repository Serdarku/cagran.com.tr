import path from "path"
import { fileURLToPath } from 'url'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// __dirname tanımlaması (ESM modülleri için daha güvenli yol)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  // EĞER siten root'ta değilse (örn: serdarku.github.io/proje-adi/) 
  // './' yerine '/proje-adi/' yazman daha iyi olur. 
  // Ama genel kullanım için './' çoğu zaman yeterlidir.
  base: './', 
  
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build çıktısının GitHub Pages tarafından doğru okunması için dist klasörünü kontrol et
  build: {
    outDir: 'dist',
  }
});
