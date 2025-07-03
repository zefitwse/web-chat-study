import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020, // 支持 ECMAScript 2020 特性
      globals: globals.browser, // 浏览器环境全局变量
      parserOptions: {
        ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
        ecmaFeatures: { jsx: true }, // 启用 JSX 支持
        sourceType: 'module', // 使用模块系统
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // 基本的 ESLint 推荐规则
      ...js.configs.recommended.rules,

      // React Hooks 相关的规则
      ...reactHooks.configs.recommended.rules,

      // 自定义规则
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }], // 忽略常量的未使用检查
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // 允许常量导出
      ],

      // 确保 React Hooks 的正确使用
      'react-hooks/rules-of-hooks': 'error', // 确保 Hooks 只在正确的地方调用
      'react-hooks/exhaustive-deps': 'warn', // 确保 useEffect 的依赖项正确
    },
  },
]
