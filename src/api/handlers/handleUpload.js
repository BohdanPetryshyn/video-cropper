const HttpStatus = require('http-status-codes');

const propagateErrors = require('../utils/propagateErrors');
const supportedContentTypes = require('../utils/supportedContentTypes');
const ApiError = require('../utils/ApiError');
const buildFileName = require('../utils/buildFileName');
const buildResultFileUrl = require('../utils/buildResultFileUrl');

const ensureSupportedContentType = contentType => {
  if (!(contentType in supportedContentTypes)) {
    throw new ApiError(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      `Unsupported Content-Type ${contentType}`
    );
  }
};

module.exports = propagateErrors(async (req, res) => {
  const contentType = req.get('Content-Type');
  ensureSupportedContentType(contentType);

  const resultFileName = buildFileName(contentType);

  res.status(HttpStatus.OK).json({
    croppedVideoUrl: buildResultFileUrl(req, resultFileName),
  });
});
