const HttpStatus = require('http-status-codes');

const propagateErrors = require('../utils/propagateErrors');
const supportedContentTypes = require('../utils/supportedContentTypes');
const ApiError = require('../utils/ApiError');

const ensureSupportedContentType = req => {
  const contentType = req.get('Content-Type');
  if (!(contentType in supportedContentTypes)) {
    throw new ApiError(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      `Unsupported Content-Type ${contentType}`
    );
  }
};

module.exports = propagateErrors(async (req, res) => {
  ensureSupportedContentType(req);
});
