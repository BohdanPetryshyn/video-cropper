const path = require('path');

const streamToFile = require('./utils/streamToFIle');
const removeFile = require('./utils/removeFile');
const defaultLogger = require('../utils/logger');

class BufferedCropper {
  constructor({ bufferDirectory, cropper, logger = defaultLogger } = {}) {
    this.bufferDirectory = bufferDirectory;
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
    return path.join(this.bufferDirectory, outputFileName);
  }
}

module.exports = BufferedCropper;
