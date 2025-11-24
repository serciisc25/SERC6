import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// FIX: Removed `import process from 'process'` as it was causing a type error.
// The config runs in a Node environment where `process` is a global and has the correct types.

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // FIX: Use `path.resolve('.')` which resolves to the current working directory, avoiding a TypeScript type error with `process.cwd()`.
          '@': path.resolve('.'),
        }
      }
    };
});