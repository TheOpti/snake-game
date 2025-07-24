import eslintRecommended from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  eslintRecommended.configs.recommended,

  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      // Prettier formatting rules (uses .prettierrc if present)
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: true,
          trailingComma: 'none'
        }
      ],

      // Remove trailing whitespace
      'no-trailing-spaces': 'error',

      // Enforce a blank line after functions and classes
      'padding-line-between-statements': [
        'error',
        // Add blank line after function declarations
        { blankLine: 'always', prev: 'function', next: '*' },
        // Add blank line after class declarations
        { blankLine: 'always', prev: 'class', next: '*' }
      ]
    }
  }
];
