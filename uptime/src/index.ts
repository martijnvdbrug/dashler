export const batchUrlsToPubsub = (req, res) => {

  // Get all Urls from datastore
  // Batch url's per 10?
  // push to pubsub

  res.send(`success`);
};

export const pollUrls = (pubSubEvent, context) => {
  const name = pubSubEvent.data ? Buffer.from(pubSubEvent.data, 'base64').toString()
    : 'World';

  // For each
  // now = new Date()
  // GET each url
  // statusCode
  // optional errorMessage
  // Get from datastore
  // Calculate new Uptimes
  // store in datastore

  return `Success`;
};
