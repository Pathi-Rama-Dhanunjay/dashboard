import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { react: reactPlugin },
    languageOptions: {
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
      'no-undef': 'error',
      'react/jsx-no-undef': 'error',
    },
  },
];
