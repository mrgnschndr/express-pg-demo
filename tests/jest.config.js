module.exports = {
    testEnvironment: 'node',
    globalSetup: './setUpDatabase.js',
    // globalTeardown: './tearDownDatabase.js',
    setupFilesAfterEnv: ['./jest.setup.js'],
};
  