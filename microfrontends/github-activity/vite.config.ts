  import { federation } from '@module-federation/vite';
  import { defineConfig } from 'vite';

  export default defineConfig({
    plugins: [
      federation({
        name: 'githubActivity',
        filename: 'remoteEntry.js',
        exposes: {
          './GithubActivity': './src/index.ts',
        },
      }),
    ],

    build: {
      target: 'esnext',
    },
  });
  