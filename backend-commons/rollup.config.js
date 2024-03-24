/* eslint-disable import/no-extraneous-dependencies */
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-re';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';

import packageJson from './package.json';

export default {
  input: glob.sync('src/?(component)/**/*.ts'),
  output: [
    {
      dir: 'lib',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
      treeshake: false,
    },
    // {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   file: packageJson.module,
    //   format: 'esm',
    //   sourcemap: true,
    // },
  ],
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    replace({
      // replace before commonjs. This is needed because pg library has an optional
      // peerdependency on pg-native. Rollup is not able to detect that it is optional
      // and always tries to require it, thus failing any import.
      // See https://github.com/rollup/rollup-plugin-commonjs/issues/424#issuecomment-559071440
      patterns: [
        {
          // regexp match with resolved path
          match: /pg\/.*/,
          // string or regexp
          test: "require('pg-native')",
          // string or function to replaced with
          replace: "''",
        },
      ],
    }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
    json(),
  ],
};
