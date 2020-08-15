const { spawn } = require('child_process');

class Cropper {
  cropFromFile(inputFileName, outputFileName) {
    return new Promise((resolve, reject) => {
      this.spawnFfmpegProcess(inputFileName, outputFileName)
        .on('error', reject)
        .on('exit', (code, signal) => {
          if (signal) {
            reject(new Error(`ffmpeg was terminated with signal ${signal}`));
          } else if (code) {
            reject(new Error(`ffmpeg finished with code ${code}`));
          } else {
            resolve();
          }
        });
    });
  }

  spawnFfmpegProcess(input, output) {
    const ffmpegArgs = this.getArgs(input, output, { cwd: process.cwd() });
    return spawn('ffmpeg', ffmpegArgs);
  }

  getArgs(input, output) {
    return ['-i', input, '-filter:v', 'crop=min(iw\\,ih):min(iw\\,ih)', output];
  }
}

module.exports = Cropper;
