import path from 'path';

import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import { patchCssModules } from 'vite-css-modules';
import react from '@vitejs/plugin-react';
import babel from "@rolldown/plugin-babel";

import playfulbotConfigLoader from 'rollup-plugin-playfulbot-config-loader';

// Used for intl/formatjs translations
// https://github.com/formatjs/formatjs/issues/3225#issuecomment-1750837469
// https://github.com/vitejs/vite-plugin-react/discussions/1148#discussioncomment-16803828
const babelPlugin = babel({
  plugins: [
    [
      'formatjs',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        ast: true,
      },
    ],
  ],
  parserOpts: {
    plugins: ['importAttributes']
  },
  generatorOpts: {
    importAttributesKeyword: 'with'
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  mode: "development",
  plugins: [
    patchCssModules({ generateSourceTypes: true, declarationMap: true }),
    react(), babelPlugin, svgrPlugin(), playfulbotConfigLoader()],
  build: {
    outDir: 'build',
    // cssMinify: 'lightningcss',
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, 'src'),
      'compiled-lang': path.resolve(__dirname, 'compiled-lang'),
      '~components': path.resolve(__dirname, './src/ui/components')
    },
  },
  css: {
    transformer: 'lightningcss',
    modules: {
      localsConvention: 'camelCaseOnly'
    }
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

