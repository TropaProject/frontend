import eslintReact from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import boundaries from 'eslint-plugin-boundaries';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'build', 'eslint.config.mjs']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@stylistic': stylistic,
      boundaries: boundaries,
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      eslintReact.configs['recommended-typescript'],
      eslintConfigPrettier,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2022,
      globals: globals.browser,
      sourceType: 'module',
    },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': [
        {
          mode: 'full',
          type: 'shared',
          pattern: ['src/shared/**/*'],
        },
        {
          mode: 'full',
          type: 'feature',
          capture: ['featureName'],
          pattern: ['src/features/*/**/*'],
        },
        {
          mode: 'full',
          type: 'widget',
          pattern: ['src/widgets/**/*'],
        },
        {
          mode: 'full',
          type: 'page',
          pattern: ['src/pages/**/*'],
        },
        {
          mode: 'full',
          type: 'app',
          pattern: ['src/app/**/*'],
        },
        {
          mode: 'full',
          type: 'entities',
          pattern: ['src/entities/*/**/*'],
          capture: ['entityName']
        },
      ],
    },
    rules: {
      '@eslint-react/no-leaked-conditional-rendering': 'warn',
      '@stylistic/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never', propElementValues: 'always' },
      ],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // Boundaries rules
      'boundaries/no-unknown': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            {
              from: ['shared'],
              allow: ['shared'],
            },
            {
              from: ['entities'],
              allow: ['shared', 'entities'],
            },
            {
              from: ['feature'],
              allow: [
                'shared',
                'entities',
                ['feature', { featureName: '${from.featureName}' }],
              ],
            },
            {
              from: ['widget'],
              allow: ['shared', 'entities', 'feature'],
            },
            {
              from: ['page'],
              allow: ['shared', 'entities', 'feature', 'widget'],
            },
            {
              from: ['app'],
              allow: ['shared', 'entities', 'feature', 'widget', 'page', 'app'],
            },
            {
              from: ['entities'],
              allow: [
                'shared',
                ['entities', { entityName: '${from.entityName}' }],
              ],
            }
          ]
        },
      ],
    },
  },
]);