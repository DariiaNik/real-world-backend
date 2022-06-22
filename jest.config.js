module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    setupFiles: ['./src/tests/setup/setEnvVars.js'],
    preset: '@shelf/jest-mongodb',
}
