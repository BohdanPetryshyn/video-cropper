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

    try {
      await this.bufferInputStream(inputStream, bufferFileName);
      await this.cropFromFile(bufferFileName, outputFileName);
    } catch (error) {
      this.logger.error({ error }, `Cropping ${outputFileName} failed.`);
    } finally {
      this.cleanUpBuffer(bufferFileName);
    }
  }

  async bufferInputStream(inputStream, bufferFileName) {
    this.logger.info(`Buffering input to ${bufferFileName}.`);
    await streamToFile(inputStream, bufferFileName);
    this.logger.info(`Input buffered successfully to ${bufferFileName}.`);
  }

  async cropFromFile(bufferFileName, outputFileName) {
    this.logger.info(
      `Cropping buffered ${bufferFileName} to ${outputFileName}.`
    );
    await this.cropper.cropFromFile(bufferFileName, outputFileName);
    this.logger.info(`${bufferFileName} cropped successfully.`);
  }

  async cleanUpBuffer(bufferFileName) {
    try {
      await removeFile(bufferFileName);
      this.logger.info(`Buffer ${bufferFileName} cleaned successfully.`);
    } catch (error) {
      this.logger.warn({ error }, `Buffer ${bufferFileName} clean up failed.`);
    }
  }

  getBufferFileName(outputFileName) {
    const fileName = path.basename(outputFileName);
    return path.join(this.bufferPath, fileName);
  }
}

module.exports = BufferedCropper;
