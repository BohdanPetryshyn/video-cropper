const defaultLogger = require('../utils/logger');
const defaultLimiter = require('./utils/ffmpegConcuerncyLimiter');

class LimitedConcurrencyCropper {
  constructor({
    limiter = defaultLimiter,
    cropper,
    logger = defaultLogger,
  } = {}) {
    this.logger = logger;
    this.cropper = cropper;
    this.limiter = limiter;
  }

  cropFromFile(inputFileName, outputFileName) {
    this.logger.info(
      `Queuing cropping from file task. Number of pending tasks: ${this.limiter.pendingTasks}.`
    );
    return this.limiter.limit(() =>
      this.cropper.cropFromFile(inputFileName, outputFileName)
    );
  }
}

module.exports = LimitedConcurrencyCropper;
