module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    './.eslintrc-auto-import.json', // 引入auto import生成的配置
  ],
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 允许any类型（可以根据需要调整）
    '@typescript-eslint/no-explicit-any': 'off',
    // 允许未使用的变量（以_开头）
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    // Vue相关规则
    'vue/multi-word-component-names': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
} 
