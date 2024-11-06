import js from '@eslint/js';
import * as parser from '@typescript-eslint/parser';
import * as eslintTs from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: false,
        },
        parser: {
          js: 'espree',
          ts: parser.default,
          '<template>': 'espree',
        },
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': eslintTs,
    },
    ...pluginVue.configs['flat/vue3-recommended'],
    rules: {
      'vue/multi-word-component-names': 'warn',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/object-curly-spacing': [2, 'always'],
      'vue/html-closing-bracket-spacing': [
        2,
        {
          selfClosingTag: 'always',
        },
      ],
      ...eslintTs.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    ignores: ['dist/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: parser.default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintTs,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
      ...eslintTs.configs.recommended.rules,
    },
  },
  eslintConfigPrettier,
];
