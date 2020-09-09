const path = require('path');

module.exports = {
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'prettier'
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    '@typescript-eslint/lines-between-class-members': ['error', { exceptOfterOverload: true }],
    '@typescript-eslint/no-dupe-class-members': 'error',
    '@typescript-eslint/no-unused-expressions': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-useless-constructor': 'error',
    'lines-between-class-members': 'off',
    'no-dupe-class-members': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': ['error', { allow: ['_id', '__typename'] }],
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-console': ['off'],
    'spaced-comment': ['error', 'always', { markers: ['/'] }]
  },
  env: {
    jest: true,
    node: true
  },
  globals: {
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', path.resolve(__dirname, 'src')],
        ],
        extensions: ['.js', '.json', '.ts']
      },
    }
  }
}
