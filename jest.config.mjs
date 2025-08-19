/** @type {import('jest').Config} */
const config = {
    verbose: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
    },
    transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],
    moduleFileExtensions: ['js', 'mjs', 'json'],
    testEnvironment: 'node',

    globals: {
        'babel-jest': {
            useESM: true,
        },
    },
    watchPathIgnorePatterns: ['/.postgres-data/'],
}

export default config
