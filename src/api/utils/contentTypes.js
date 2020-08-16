const contentTypes = {
  AVI: 'video/x-msvideo',
  MP4: 'video/mp4',
};

const contentTypeExtensions = {
  [contentTypes.MP4]: 'mp4',
  [contentTypes.AVI]: 'avi',
};

module.exports = {
  contentTypes,
  contentTypeExtensions,
};
