const { RESULTS_PATH, BUFFER_PATH } = require('./config');
const logger = require('./logger');
const mkdirRecursive = require('./mkdirRecursive');

module.exports = () =>
  Promise.all([
    mkdirRecursive(RESULTS_PATH),
    mkdirRecursive(BUFFER_PATH),
  ]).then(() =>
    logger.info(
      `Results path ${RESULTS_PATH}, buffer path ${BUFFER_PATH} created successfully.`
    )
  );
