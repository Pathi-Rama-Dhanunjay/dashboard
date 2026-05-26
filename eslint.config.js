import reactPlugin from 'eslint-plugin-react';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react: reactPlugin, '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'react/jsx-no-undef': 'error',
    },
  },
];
