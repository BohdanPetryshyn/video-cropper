const fs = require('fs');

module.exports = (inputStream, fileName) => {
  return new Promise((resolve, reject) => {
    const fileWriteStream = fs.createWriteStream(fileName);
    inputStream.pipe(fileWriteStream).on('finish', resolve).on('error', reject);
  });
};
