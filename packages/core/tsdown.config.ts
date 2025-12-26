import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  hash: false, // Disable hashing for stable filenames
  platform: 'neutral',
})
