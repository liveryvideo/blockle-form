module.exports = wallaby => ({
  files: ['tsconfig.json', 'src/**/*.ts?(x)', 'src/**/*.snap', '!src/**/*.spec.ts?(x)'],
  tests: ['src/**/*.spec.ts?(x)'],
  env: {
    type: 'node',
    runner: 'node',
  },
  compilers: {
    '**/*.ts?(x)': wallaby.compilers.typeScript({
      isolatedModules: true,
      module: 'commonjs',
    }),
  },
  testFramework: 'jest',
});
