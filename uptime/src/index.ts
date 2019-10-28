import {PollingService} from './polling.service';
import {BatchService} from './batch.service';

export const uptime_batchUrlsToPubsub = async (req, res) => {
  try {
    await BatchService.publishUrls();
  } catch (e) {
    console.error(`Error batching URL's to pubsubs!`, e);
    res.status(500).send();
    return;
  }
  res.send(`success`);
};

export const uptime_pollUrls = async (pubSubEvent, context) => {
  const urls: string[] = JSON.parse(Buffer.from(pubSubEvent.data, 'base64').toString());
  await PollingService.checkMultiple(urls);
  return `success`;
};
