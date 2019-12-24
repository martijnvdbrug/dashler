import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {UserEntity} from '../src/app/user/model/user.entity';

(async () => {

  const email = 'martijn@mistergreen.nl';

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const userRepo: DatastoreClient<UserEntity> = ctx.get('UserRepo');

  const users = await userRepo.getAll();
  console.log(`total users:          ${users.length}`);

  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  const createdLastMonth = users.filter(u => (new Date (u.createdAt)) > lastMonth );
  console.log(`Signups last 30 days: ${createdLastMonth.length}`);

  process.exit(0);

})();
