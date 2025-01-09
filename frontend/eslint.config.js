import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    plugins: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended']
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended
];
