const runServer = require('./src/api/server');
const setupEnvironment = require('./src/utils/setupEnvironment');

setupEnvironment().then(runServer);
