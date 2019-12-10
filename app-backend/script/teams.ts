import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {UserEntity} from '../src/app/user/model/user.entity';
import {UserService} from '../src/app/user/user.service';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const userRepo: DatastoreClient<UserEntity> = ctx.get('UserRepo');
  const userService: UserService = ctx.get(UserService);
  const users = await userRepo.getAll();
  for (const user of users) {

    if (user.email === 'martijn.brug@gmail.com') {
      continue;
    }

    const team = await userService.addToTeam(user.email, '_nZ4cQ0D9-team-yannick@mistergreen.nl');

    console.log(`Added ${user.email} to team ${team.id}`);
  }

  process.exit(0);

})();
