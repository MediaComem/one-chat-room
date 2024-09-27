import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import promise from 'eslint-plugin-promise';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['node_modules', 'public', 'tmp']
  },
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  js.configs.all,
  sonarjs.configs.recommended,
  unicorn.configs['flat/recommended'],
  promise.configs['flat/recommended'],
  ...fixupConfigRules(
    compat.extends(
      // https://github.com/import-js/eslint-plugin-import/issues/2948
      'plugin:import/recommended'
    )
  ),
  eslintConfigPrettier,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      ecmaVersion: 12,
      sourceType: 'module'
    },
    settings: {
      'import/internal-regex': '^src/'
    },
    rules: {
      'dot-notation': 'off',
      'func-style': [
        'error',
        'declaration',
        {
          allowArrowFunctions: true
        }
      ],
      'id-length': [
        'error',
        {
          exceptions: ['i', 'n']
        }
      ],
      'import/default': 'off',
      'import/namespace': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc'
          },

          groups: [
            ['builtin', 'external'],
            ['internal', 'sibling', 'parent']
          ],
          'newlines-between': 'always'
        }
      ],
      'max-params': ['error', 5],
      'max-statements': ['error', 20],
      'new-cap': 'off',
      'no-magic-numbers': 'off',
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-ternary': 'off',
      'no-undefined': 'off',
      'no-underscore-dangle': [
        'error',
        {
          allow: ['_id']
        }
      ],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      'no-use-before-define': [
        'error',
        {
          classes: false,
          functions: false
        }
      ],
      'one-var': ['error', 'never'],
      'promise/no-callback-in-promise': 'off',
      'sonarjs/new-cap': 'off',
      'sort-imports': 'off',
      'sort-keys': 'off',
      'unicorn/catch-error-name': [
        'error',
        {
          name: 'err'
        }
      ],
      'unicorn/explicit-length-check': [
        'error',
        {
          'non-zero': 'not-equal'
        }
      ],
      'unicorn/import-style': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  }
];
