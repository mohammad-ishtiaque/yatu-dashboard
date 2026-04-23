import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// @ alias: import anything from src/ using @/...
// e.g. import { Button } from '@/components/ui/Button'
// Survives any folder depth — critical for large projects
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
