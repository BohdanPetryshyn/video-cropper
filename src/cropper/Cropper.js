const { spawn } = require('child_process');

const defaultLogger = require('../utils/logger');

class Cropper {
  constructor({ logger = defaultLogger } = {}) {
    this.logger = logger;

    this.handleFfmpegProcessExit = this.handleFfmpegProcessExit.bind(this);
  }

  cropFromFile(inputFileName, outputFileName) {
    return new Promise((resolve, reject) => {
      this.spawnFfmpegProcess(inputFileName, outputFileName, resolve, reject);
    });
  }

  cropFromStream(inputStream, outputFile) {
    return new Promise((resolve, reject) => {
      const ffmpegProcess = this.spawnFfmpegProcess(
        'pipe:',
        outputFile,
        resolve,
        reject
      );

      ffmpegProcess.stderr.pipe(process.stdout);

      inputStream.pipe(ffmpegProcess.stdin).on('error', reject);
    });
  }

  spawnFfmpegProcess(input, output, resolve, reject) {
    const ffmpegArgs = Cropper.getArgs(input, output);

    this.logger.info(`Spawning ffmpeg process with args ${ffmpegArgs}.`);
    const ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    ffmpegProcess
      .on('error', reject)
      .on('exit', this.handleFfmpegProcessExit(ffmpegProcess, resolve, reject));

    this.logger.info(`ffmpeg process PID ${ffmpegProcess.pid} spawned.`);
    return ffmpegProcess;
  }

  handleFfmpegProcessExit(ffmpegProcess, resolve, reject) {
    return (code, signal) => {
      if (signal) {
        reject(
          new Error(
            `ffmpeg process PID ${ffmpegProcess.pid} was terminated with signal ${signal}.`
          )
        );
      } else if (code) {
        reject(
          new Error(
            `ffmpeg process PID ${ffmpegProcess.pid} finished with code ${code}.`
          )
        );
      } else {
        this.logger.info(
          `ffmpeg process PID ${ffmpegProcess.pid} finished with code 0.`
        );
        resolve();
      }
    };
  }

  static getArgs(input, output) {
    return [
      // Indicate that the input will go next.
      '-i',
      // Input name. Could be a file name or 'pipe:'
      // which mean that ffmpeg will accept it's stdin as input.
      input,
      // Indicate that the video filter description will go next.
      '-filter:v',
      // Crop video to the square of it's minimum dimension.
      // Centered by default.
      'crop=min(iw\\,ih):min(iw\\,ih)',
      // Indicate that the video encoder will go next.
      '-c:a',
      // Audio being copied without changes.
      'copy',
      // Output name.
      output,
    ];
  }
}

module.exports = Cropper;
