import { PollingService} from '../src/polling.service';
import {BatchService} from '../src/batch.service';

(async () => {

   await BatchService.publishUrls();
  // console.log(await PollingService.request('https://httpstat.us/302'));
  // console.log(await PollingService.request('http://httpstat.us/200?sleep=5000'));
  // await PollingService.checkMultiple(['https://api.mistergreen.io/api/wololo']);
  process.exit(0);

})();
