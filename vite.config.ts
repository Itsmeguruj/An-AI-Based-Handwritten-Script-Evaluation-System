import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        timeout: 25000,
        proxyTimeout: 25000,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[vite-proxy] Error connecting to backend:', err.message);
            const response = res as any;
            if (response && !response.headersSent && typeof response.writeHead === 'function') {
              response.writeHead(503, { 'Content-Type': 'application/json' });
              response.end(JSON.stringify({
                error: 'Backend API server (port 5000) is unreachable. Please verify that the DeepScript server is running.'
              }));
            }
          });
        }
      }
    }
  }
})
