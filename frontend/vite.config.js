import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
     base: mode === 'production' ? '/' : env.VITE_BASE_URL || '/',
     preview: {
      port: 5173,
    }
  });
};
