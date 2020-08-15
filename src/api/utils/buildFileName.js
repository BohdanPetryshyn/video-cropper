const { v4: uuidv4 } = require('uuid');

const { contentTypeExtensions } = require('./contentTypes');

module.exports = contentType => {
  const fileName = uuidv4();
  const fileExtension = contentTypeExtensions[contentType];

  return `${fileName}.${fileExtension}`;
};
