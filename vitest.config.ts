import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './test/server-only-mock.ts'),
    },
  },
  test: {
    exclude: [...configDefaults.exclude, 'tests/**', '.claude/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
  },
})
