module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'ts', 'tsx'],
  moduleDirectories: ['node_modules', '../..'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/spec/*.spec.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/']
};
