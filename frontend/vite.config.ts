import path from 'path';

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgrPlugin from 'vite-plugin-svgr';

import playfulbotConfigLoader from 'rollup-plugin-playfulbot-config-loader';

// https://vitejs.dev/config/
export default defineConfig({
  mode: "development",
  plugins: [reactRefresh(), svgrPlugin(), playfulbotConfigLoader()],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src')
    },
  },
  server: {
    host: "local-playfulbot.com",
    port: 3000,
    strictPort: true,
    hmr: {
        clientPort: 443,
    }
},
})

