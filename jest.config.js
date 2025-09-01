module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/__tests__/setupTests.js'],
  testMatch: [
    '<rootDir>/frontend/__tests__/**/*.test.js',
    '<rootDir>/frontend/**/*.(test).js'
  ],
  collectCoverageFrom: [
    'frontend/assets/js/**/*.js',
    'frontend/components/**/*.js',
    '!frontend/assets/js/vendor/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  }
};