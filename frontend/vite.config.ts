import path from 'path';

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import svgrPlugin from 'vite-plugin-svgr';
import react from '@vitejs/plugin-react';

import playfulbotConfigLoader from 'rollup-plugin-playfulbot-config-loader';

// Used for intl/formatjs translations
// https://github.com/formatjs/formatjs/issues/3225#issuecomment-1750837469
const reactPlugin = react({
  babel: {
    plugins: [
      [
        'formatjs',
        {
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
          ast: true,
        },
      ],
    ]
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  mode: "development",
  plugins: [reactPlugin, reactRefresh(), svgrPlugin(), playfulbotConfigLoader()],
  build: {
    outDir: 'build',
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'compiled-lang': path.resolve(__dirname, 'compiled-lang'),
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

