const { RESULTS_PATH } = require('../../utils/config');

module.exports = (req, fileName) => {
  const { protocol } = req;
  const host = req.get('host');

  return `${protocol}://${host}/${RESULTS_PATH}/${fileName}`;
};
