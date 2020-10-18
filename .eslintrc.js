module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    '@typescript-eslint/lines-between-class-members': [
      'error',
      { exceptOfterOverload: true },
    ],
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-redeclare': [
      'error',
      { ignoreDeclarationMerge: true },
    ],
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-useless-constructor': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'lines-between-class-members': 'off',
    'no-dupe-class-members': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-redeclare': 'off',
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-console': ['off'],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
  },
  env: {
    node: true,
  },
  globals: {
    NodeJS: true,
  },
};
