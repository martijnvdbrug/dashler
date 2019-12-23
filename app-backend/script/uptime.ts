import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {Uptime} from '../src/lib/shared/graphql-types';
import {BlockEntity} from '../src/app/dashboard/model/block.entity';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const uptimeRepo: DatastoreClient<Uptime> = ctx.get('UptimeRepo');
  const uptimes = await uptimeRepo.getAll();
  for (const uptime of uptimes) {
    uptime.url = uptime.id;
    await uptimeRepo.update(uptime.id, uptime);
    console.log(`Updated uptime ${uptime.id}`);
  }

  process.exit(0);

})();
