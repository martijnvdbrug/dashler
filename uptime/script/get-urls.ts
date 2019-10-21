import {PollingService} from '../src/polling.service';

(async () => {

  await PollingService.getUrls();
  process.exit(0);

})();
