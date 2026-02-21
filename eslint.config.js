// https://docs.expo.dev/guides/using-eslint/
const path = require('path');
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', path.join(__dirname)]],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
        node: true,
      },
    },
    rules: {
      // @/ is resolved by tsconfig + alias resolver; relax when IDE resolver fails
      'import/no-unresolved': [
        'error',
        { ignore: ['^@/'] },
      ],
    },
  },
]);
