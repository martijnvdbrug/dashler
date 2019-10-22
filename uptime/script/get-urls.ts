import {BatchService} from '../src/polling.service';

(async () => {

  await BatchService.getUrls();
  process.exit(0);

})();
