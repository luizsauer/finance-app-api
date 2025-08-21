import js from '@eslint/js'
import globals from 'globals'

/** @type {import("eslint").Linter.Config} */
// module.exports = {
//     env: {
//         node: true,
//         es2021: true,
//         jest: true,
//     },
//     extends: ['eslint:recommended', 'prettier'],
//     parserOptions: {
//         ecmaVersion: 15,
//         sourceType: 'module',
//     },
//     rules: {},
// }

export default [
    js.configs.recommended,
    {
        files: ['*.js', '*.jsx', '*.cjs', '*.mjs', '*.ts', '*.tsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
        },
        // env: {
        //     node: true,
        //     es2021: true,
        //     jest: true,
        // },
        // extends: ['eslint:recommended', 'prettier'],
        // parserOptions: {
        //     ecmaVersion: 15,
        //     sourceType: 'module',
        // },
        // rules: {},
    },
]
