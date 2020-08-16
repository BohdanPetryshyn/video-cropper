const HttpStatus = require('http-status-codes');

const { contentTypes } = require('../utils/contentTypes');
const ApiError = require('../utils/ApiError');
const buildFileName = require('../utils/buildFileName');
const buildResultFileUrl = require('../utils/buildResultFileUrl');
const buildResultFilePath = require('../utils/buildResultFilePath');
const Cropper = require('../../crop/Cropper');
const BufferedCropper = require('../../crop/BufferedCropper');
const { BUFFER_PATH } = require('../../utils/config');

const ensureSupportedContentType = contentType => {
  if (!Object.values(contentTypes).includes(contentType)) {
    throw new ApiError(
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      `Unsupported Content-Type ${contentType}`
    );
  }
};

const cropMp4 = async (req, resultFileName) => {
  req.log.info(`Cropping ${resultFileName}.`);
  const bufferedCropper = new BufferedCropper({
    bufferPath: BUFFER_PATH,
    cropper: new Cropper({
      logger: req.log,
    }),
    logger: req.log,
  });

  await bufferedCropper.cropFromStream(req, resultFileName);
};

const cropAvi = async (req, resultFileName) => {
  req.log.info(`Cropping ${resultFileName}.`);
  const cropper = new Cropper({
    logger: req.log,
  });

  await cropper.cropFromStream(req, resultFileName);
};

module.exports = (req, res) => {
  const contentType = req.get('Content-Type');
  ensureSupportedContentType(contentType);

  const resultFileName = buildFileName(contentType);

  res.status(HttpStatus.OK).json({
    croppedVideoUrl: buildResultFileUrl(req, resultFileName),
  });

  if (contentType === contentTypes.MP4) {
    cropMp4(req, buildResultFilePath(resultFileName));
  }

  if (contentType === contentTypes.AVI) {
    cropAvi(req, buildResultFilePath(resultFileName));
  }
};
