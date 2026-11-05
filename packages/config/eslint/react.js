import reactHooks from 'eslint-plugin-react-hooks';
import base from './base.js';

/** Flat config for React (web, ui, mobile). */
export default [
  ...base,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
