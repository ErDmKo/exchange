const {defaults} = require('jest-config');
module.exports = {
    globalSetup: './globalSetup.js',
    globalTeardown: './globalTeardown.js',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts'],
};