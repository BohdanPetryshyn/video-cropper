const express = require('express');
const expressPinoLogger = require('express-pino-logger');

const logger = require('../utils/logger');
const handleApiError = require('./middleware/handleApiError');
const handleError = require('./middleware/handleError');
const { PORT } = require('../utils/config');
const handleUpload = require('./handlers/handleUpload');

const app = express();

app.use(
  expressPinoLogger({
    logger,
  })
);

app.post('/video', handleUpload);

app.use(handleApiError);
app.use(handleError);

module.exports = () =>
  app.listen(PORT, logger.info(`Server listening on port ${PORT}`));
