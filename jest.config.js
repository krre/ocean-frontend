module.exports = {
  roots: [
    "<rootDir>/tests"
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
  ]
};
