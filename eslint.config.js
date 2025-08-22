import js from '@eslint/js'
import globals from 'globals'

export default [
    js.configs.recommended,

    // Ignorar arquivos gerados pelo Prisma
    {
        ignores: ['src/generated/**'],
    },

    // Configuração para todos os arquivos de código
    {
        files: ['*.js', '*.jsx', '*.cjs', '*.mjs', '*.ts', '*.tsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.browser,
            },
        },
        plugins: ['prettier'],
        rules: {
            'prettier/prettier': 'error',
            'no-console': 'off',
            'no-undef': 'off',
        },
    },

    // Configuração para arquivos de teste (Jest)
    {
        files: ['**/*.test.js', '**/*.spec.js', '**/*.test.ts', '**/*.spec.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
                ...globals.jest, // Adiciona globais do Jest
            },
        },
    },
]
