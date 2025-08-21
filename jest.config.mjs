/** @type {import('jest').Config} */
const config = {
    verbose: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/src/generated/prisma/'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.js'],
    // globalTeardown: '<rootDir>/jest.global-teardown.js',
    watchPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/docker-data/',
    ],
}

export default config
