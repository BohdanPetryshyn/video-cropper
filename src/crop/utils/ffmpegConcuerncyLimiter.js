const pLimit = require('p-limit');

const { FFMPEG_CONCURRENCY_LIMIT } = require('../../utils/config');

const limitFfmpeg = pLimit(FFMPEG_CONCURRENCY_LIMIT);

module.exports = {
  limit: limitFfmpeg,
  getPendingTasksCount: () => limitFfmpeg.pendingCount,
};
