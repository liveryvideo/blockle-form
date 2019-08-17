import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

const banner = `/**
  * ${pkg.name} v${pkg.version}
  * (C) 2019-${new Date().getFullYear()} ${pkg.author}
  * Released under the ${pkg.license} License.
  */`;

export default [
  {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.peerDependencies || {})],
    output: [
      {
        banner,
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
      },
      {
        banner,
        file: pkg.module,
        format: 'es',
      },
    ],
    plugins: [
      resolve({
        extensions: ['.ts', '.tsx'],
      }),
      typescript(),
      commonjs(),
    ],
  },
];
