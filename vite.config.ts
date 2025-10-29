import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: true,
    hmr: true
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
    outDir: 'dist',
    sourcemap: true
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.tsx?$/,
    exclude: []
  }
});
