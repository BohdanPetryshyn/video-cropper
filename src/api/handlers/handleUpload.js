const HttpStatus = require('http-status-codes');

const { contentTypes } = require('../utils/contentTypes');
const ApiError = require('../utils/ApiError');
const buildFileName = require('../utils/buildFileName');
const buildResultFileUrl = require('../utils/buildResultFileUrl');
const buildResultFilePath = require('../utils/buildResultFilePath');
const Cropper = require('../../crop/Cropper');
const BufferedCropper = require('../../crop/BufferedCropper');
const LimitedConcurrencyCropper = require('../../crop/LimitedConcurrencyCropper');

const ensureSupportedContentType = contentType => {
  if (!Object.values(contentTypes).includes(contentType)) {
    throw new ApiError(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      `Unsupported Content-Type ${contentType}`
    );
  }
};

const buildCropper = req => {
  const cropper = new Cropper({
    logger: req.log,
  });
  const limitedConcurrencyCropper = new LimitedConcurrencyCropper({
    logger: req.log,
    cropper,
  });
  return new BufferedCropper({
    logger: req.log,
    cropper: limitedConcurrencyCropper,
  });
};

const cropVideo = async (req, resultFileName) => {
  req.log.info(`Cropping ${resultFileName}.`);

  const cropper = buildCropper(req);

  try {
    await cropper.cropFromStream(req, resultFileName);
  } catch (error) {
    req.log.error({ error }, `File cropping failed.`);
  }
};

module.exports = (req, res) => {
  const contentType = req.get('Content-Type');
  ensureSupportedContentType(contentType);

  const resultFileName = buildFileName(contentType);

  res.status(HttpStatus.OK).json({
    croppedVideoUrl: buildResultFileUrl(req, resultFileName),
  });

  cropVideo(req, buildResultFilePath(resultFileName));
};
