const express = require('express');
const expressPinoLogger = require('express-pino-logger');

const logger = require('../utils/logger');
const { PORT } = require('../utils/config');

const app = express();

app.use(
  expressPinoLogger({
    logger,
  })
);

module.exports = () =>
  app.listen(PORT, logger.info(`Server listening on port ${PORT}`));
