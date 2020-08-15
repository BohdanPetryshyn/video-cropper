const { v4: uuidv4 } = require('uuid');

const supportedContentTypes = require('./supportedContentTypes');

module.exports = contentType => {
  const fileName = uuidv4();
  const fileExtension = supportedContentTypes[contentType];

  return `${fileName}.${fileExtension}`;
};
