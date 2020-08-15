const express = require('express');
const expressPinoLogger = require('express-pino-logger');

const logger = require('../utils/logger');
const handleApiError = require('./middleware/handleApiError');
const handleError = require('./middleware/handleError');
const { PORT } = require('../utils/config');

const app = express();

app.use(
  expressPinoLogger({
    logger,
  })
);

app.use(handleApiError);
app.use(handleError);

module.exports = () =>
  app.listen(PORT, logger.info(`Server listening on port ${PORT}`));
