const path = require('path');

const streamToFile = require('./utils/streamToFIle');
const removeFile = require('./utils/removeFile');
const defaultLogger = require('../utils/logger');

class BufferedCropper {
  constructor({ bufferPath, cropper, logger = defaultLogger } = {}) {
    this.bufferPath = bufferPath;
    this.cropper = cropper;
    this.logger = logger;
  }

  async cropFromStream(inputStream, outputFileName) {
    const bufferFileName = this.getBufferFileName(outputFileName);

    await streamToFile(inputStream, bufferFileName);

    await this.cropper.cropFromFile(bufferFileName, outputFileName);

    this.cleanUpBuffer(bufferFileName);
  }

  cleanUpBuffer(bufferFileName) {
    removeFile(bufferFileName).catch(error =>
      this.logger.warn({ error }, 'Buffer clean up failed.')
    );
  }

  getBufferFileName(outputFileName) {
    const fileName = path.basename(outputFileName);
    return path.join(this.bufferPath, fileName);
  }
}

module.exports = BufferedCropper;
