/** @type {import('jest').Config} */
const config = {
    verbose: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/src/generated/prisma/'],
    globalSetup: '<rootDir>/jest.global-setup.mjs',
    // globalTeardown: '<rootDir>/jest.global-teardown.js',
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

export default config
