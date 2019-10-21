import {Uptime} from '../../shared/graphql-types';
import {DatastoreClient} from './lib/datastore/datastore.client';
import {HourRange} from './lib/shared/graphql-types';

export class PollingService {

  static repo = new DatastoreClient<Uptime>('Uptime');

  static async getUrls(): Promise<void> {
    const minuteOfDay = Math.ceil(new Date().getMinutes() / 5 ) * 5;
    const checkForIntervals: number[] = [];
    for (let m = 5; m <= 60; m += 5) {
      if (minuteOfDay % m === 0) {
        checkForIntervals.push(m);
      }
    }
    console.log(`Checking URLs with interval ${checkForIntervals}`);
    const uptimesArray: Uptime[][] = await Promise.all(
      checkForIntervals.map(interval => PollingService.repo.query({property: 'checkInterval', operator: '=', value: interval}))
    );
    const uptimes = uptimesArray.reduce((a, b) => a.concat(b));
    console.log('getting urls', uptimes.map(u => u.id));
    const urls = uptimes
      .filter(u => !PollingService.disableNow(u.disabledHours, u.id))
      .map(u => u.id);

    while (urls.length) {
      const batch = urls.splice(0, 10);
      await PollingService.publishToPubSub(batch);
      console.log(`publishing ${batch}`);
    }
  }

  static async publishToPubSub(urls: string[]): Promise<void> {
    return undefined;
  }

  static disableNow(disabledHours: HourRange, url: string): boolean {
    if (!disabledHours || !disabledHours.from || !disabledHours.to) {
      return false;
    }
    try {
      const now = new Date().getHours();
      const from = disabledHours.from.getHours();
      let to = disabledHours.to.getHours();
      const range = Math.abs(from - to);
      if (to < from) {
        to += 24; // Because 11h - 1h should be 11h - 25h
      }
      return now >= from && now < to;
    } catch (e) {
      console.error(`Error getting disabled hours for ${url}`, e);
      return false;
    }
  }
}
