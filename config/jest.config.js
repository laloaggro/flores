module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/frontend/__tests__/setupTests.js'],
  testMatch: [
    '<rootDir>/frontend/__tests__/unit/**/*.test.js',
    '<rootDir>/frontend/__tests__/integration/**/*.test.js'
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
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/frontend/assets/js/vendor/',
    '/dev/__tests__/',  // Ignorar las pruebas duplicadas en /dev
    '/tests/'  // Ignorar pruebas antiguas en la raíz
  ],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "/node_modules/(?!@babel)"
  ],
  globals: {
    'babel-jest': {
      isolatedModules: true,
      esModuleInterop: true
    }
  }
};