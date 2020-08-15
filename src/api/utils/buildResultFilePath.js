const path = require('path');

const { RESULTS_PATH } = require('../../utils/config');

module.exports = fileName => path.join(RESULTS_PATH, fileName);
