const { setup: setupDevServer } = require('jest-dev-server')

module.exports = async function globalSetup() {
  await setupDevServer({
    command: 'npm start',
    launchTimeout: 10000,
    port: 8080
  })

  // Your global setup
  console.log("globalSetup.js was invoked");
}