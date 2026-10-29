import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.join(root, 'index.js'),
      formats: ['cjs'],
      fileName: () => 'index.js'
    },
    outDir: 'dist',
    emptyOutDir: true,
    // claycli's Vite build targets es2017 and Kiln supports Chrome 87 / Safari 14: nothing newer than that, in syntax
    // or in the APIs lib/ calls, may reach this file
    target: 'es2017'
  }
});
