const crypto = require('crypto');
const generateFeed = require('./generate-feed');
const logging = require('@tryghost/logging');
const feedCache = {};

/**
 * @returns {string}
 */
module.exports.getXML = function getFeedXml(baseUrl, data) {
  const dataHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  if (!feedCache[baseUrl] || !crypto.timingSafeEqual(Buffer.from(feedCache[baseUrl].hash), Buffer.from(dataHash))) {
    // We need to regenerate
    feedCache[baseUrl] = {
      hash: dataHash,
      xml: generateFeed(baseUrl, data),
    };
  } else {
    logging.info('[RSS] Serving from in-memory cache');
  }

  return feedCache[baseUrl].xml;
};
