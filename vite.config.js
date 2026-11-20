import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH بيتحدد من GitHub Actions (/qasasimv2/) — على Cloudflare أو لوكال بيبقى /
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
