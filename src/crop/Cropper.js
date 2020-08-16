const { spawn } = require('child_process');

class Cropper {
  cropFromFile(inputFileName, outputFileName) {
    return new Promise((resolve, reject) => {
      const ffmpeg = this.spawnFfmpegProcess(inputFileName, outputFileName)
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
      ffmpeg.stderr.pipe(process.stdout);
    });
  }

  cropFromStream(inputStream, outputFile) {
    return new Promise((resolve, reject) => {
      const ffmpegProcess = this.spawnFfmpegProcess('pipe:', outputFile)
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

      inputStream.pipe(ffmpegProcess.stdin).on('error', reject);
    });
  }

  spawnFfmpegProcess(input, output) {
    const ffmpegArgs = this.getArgs(input, output);
    return spawn('ffmpeg', ffmpegArgs);
  }

  getArgs(input, output) {
    return [
      // Indicate that the input will go next.
      '-i',
      // Input name. Could be a file name or 'pipe:'
      // which mean that ffmpeg will accept it's stdin as input.
      input,
      // Indicate that the video filter descriptions will go next.
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
