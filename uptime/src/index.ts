import {BatchService} from './polling.service';

export const batchUrlsToPubsub = async (req, res) => {
  try {
    await BatchService.getUrls();
  } catch (e) {
    console.error(`Error batching URL's to pubsubs!`, e);
    res.status(500).send();
    return;
  }
  res.send(`success`);
};

export const pollUrls = (pubSubEvent, context) => {
  const urls: string[] = JSON.parse(Buffer.from(pubSubEvent.data, 'base64').toString());
  // For each
  // now = new Date()
  // GET each url
  // statusCode
  // optional errorMessage
  // Get from datastore where minutes = X
  // https://stackoverflow.com/questions/44202426/how-to-do-a-keys-only-query-in-google-cloud-datastore-node-js
  // Calculate new Uptimes
  // store in datastore
  return `success`;
};
