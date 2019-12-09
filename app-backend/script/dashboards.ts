import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {TeamService} from '../src/app/team/team.service';
import {DatastoreClient} from '../src/lib/datastore/datastore.client';
import {Plans} from '../src/app/plan/plans';
import {UserEntity} from '../src/app/user/model/user.entity';
import {DashboardEntity} from '../src/app/dashboard/model/dashboard.entity';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const dashboardRepo: DatastoreClient<DashboardEntity> = ctx.get('DashboardRepo');
  const dashboards = await dashboardRepo.getAll();
  for (const dashboard of dashboards) {

    delete (dashboard as any).users;
    await dashboardRepo.update(dashboard.id, dashboard);
    console.log(`Updated dashboard ${dashboard.id}`);
  }

  process.exit(0);

})();
