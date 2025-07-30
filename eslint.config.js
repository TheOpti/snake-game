import js from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 }
    },
    rules: {
      // your non-formatting rules
      'no-trailing-spaces': 'error',
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: 'class', next: '*' }
      ]
    }
  },

  prettierRecommended,

  {
    rules: {
      'prettier/prettier': [
        'error',
        { singleQuote: true, semi: true, trailingComma: 'none' }
      ]
    }
  }
];
