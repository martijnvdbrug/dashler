import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {DashboardEntity} from '../src/app/dashboard/model/dashboard.entity';
import {Uptime} from '../../shared/graphql-types';
import {readableId} from '../src/lib/readable-id';
import * as normalizeUrl from 'normalize-url';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const dashboardRepo: DatastoreClient<DashboardEntity> = ctx.get('DashboardRepo');
  const uptimeRepo: DatastoreClient<Uptime> = ctx.get('UptimeRepo');
  const dashboards = await dashboardRepo.getAll();
  for (const dashboard of dashboards) {

    for (const block of dashboard.blocks) {
      if (!(block as any).url) {
        continue;
      }
      const oldUptimeId = normalizeUrl((block as any).url);
      const uptimeId = readableId((block as any).url);
      block.uptimeId = uptimeId;
      const uptime = await uptimeRepo.get(oldUptimeId);
      if (uptime.url) {
        continue; // already updated
      }
      uptime.url = oldUptimeId;
      uptime.id  = uptimeId;
      await uptimeRepo.remove(oldUptimeId);
      await uptimeRepo.save(uptime);
      console.log(`     Updated uptime ${uptime.id}`);
    }
    await dashboardRepo.update(dashboard.id, dashboard);
    console.log(`Updated dashboard ${dashboard.id}`);
  }

  process.exit(0);

})();
