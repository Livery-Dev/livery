import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    middleware: 'src/middleware.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  hash: false, // Disable hashing for stable filenames
  platform: 'neutral',
  external: ['next', 'react', 'react-dom'],
})
