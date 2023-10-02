/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/vendor/',
    '<rootDir>/config/',
    '<rootDir>/log/',
    '<rootDir>/public/',
    '<rootDir>/tmp/',
    '<rootDir>/app/javascript/themes/',
  ],
  setupFilesAfterEnv: ['<rootDir>/app/javascript/flavours/aether/test_setup.js'],
  collectCoverageFrom: [
    'app/javascript/flavours/aether/**/*.{js,jsx,ts,tsx}',
    '!app/javascript/flavours/aether/features/emoji/emoji_compressed.js',
    '!app/javascript/flavours/aether/service_worker/entry.js',
    '!app/javascript/flavours/aether/test_setup.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/app/javascript'],
};

module.exports = config;

