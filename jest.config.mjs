/** @type {import('jest').Config} */
const config = {
    verbose: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/src/generated/prisma/'],
}

export default config
