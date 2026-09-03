import { federation } from '@module-federation/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: 'http://localhost:4173/',

  server: {
    port: 4173,
    strictPort: true,
    origin: 'http://localhost:4173',
    cors: true,
  },

  plugins: [
    federation({
      name: 'github_activity',
      filename: 'remoteEntry.js',
      manifest: true,
      exposes: {
  './mount': './src/index.ts',
      },

        shared: {},

    }),
  ],

  build: {
  target: 'chrome89',
  },
});
