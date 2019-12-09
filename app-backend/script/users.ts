import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {TeamService} from '../src/app/team/team.service';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {Plans} from '../src/app/plan/plans';
import {UserEntity} from '../src/app/user/model/user.entity';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const userRepo: DatastoreClient<UserEntity> = ctx.get('UserRepo');
  const teamService: TeamService = ctx.get(TeamService);
  const users = await userRepo.getAll();
  for (const user of users) {

    delete (user as any).dashboardIds;
    delete (user as any).plan;
    if (!user.teamId) {
      const team = await teamService.create(user.email, Plans.getDefaultPlan(user.email));
      user.teamId = team.id;
    }
    await userRepo.update(user.email, user);
    console.log(`Created team ${user.teamId}`);
  }

  process.exit(0);

})();
