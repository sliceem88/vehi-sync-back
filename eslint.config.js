import { configApp } from '@adonisjs/eslint-config'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import stylistic from '@stylistic/eslint-plugin'
export default configApp({
  plugins: {
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
    '@stylistic': stylistic,
  },
  rules: {
    /*
    |--------------------------------------------------------------------------
    | Code correctness
    |--------------------------------------------------------------------------
    */
    'curly': ['error', 'all'],
    'brace-style': 'off',
    'nonblock-statement-body-position': ['error', 'below'],

    /*
    |--------------------------------------------------------------------------
    | TypeScript
    |--------------------------------------------------------------------------
    */
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',

    /*
    |--------------------------------------------------------------------------
    | Imports
    |--------------------------------------------------------------------------
    */
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Formatting (Stylistic – TS safe)
    |--------------------------------------------------------------------------
    */
    'indent': 'off',
    'no-multi-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'object-curly-spacing': 'off',

    '@stylistic/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 'first',
        FunctionDeclaration: { parameters: 'first', body: 1 },
        FunctionExpression: { parameters: 'first', body: 1 },
        CallExpression: { arguments: 'first' },
        ArrayExpression: 'first',
        ObjectExpression: 'first',
        ImportDeclaration: 'first',
      },
    ],

    '@stylistic/object-curly-spacing': ['error', 'always'],
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
  },
})
