import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

export default {
  input: {
    "backend/index": "src/backend/index.ts",
    "frontend/index": "src/frontend/index.ts"
  },
  external: ['react','react-dom'],
  output: [
    {
      dir: "lib",
      entryFileNames: "[name].js",
      format: "cjs",
      sourcemap: true
    },
    {
      dir: "lib",
      entryFileNames: "[name].esm.js",
      format: "esm",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      exclude: ["**/*.stories.tsx"],
    }),
    postcss({
        extensions: ['.css']
    })
  ]
};
