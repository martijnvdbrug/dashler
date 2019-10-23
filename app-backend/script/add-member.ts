import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DashboardService} from '../src/app/dashboard/dashboard.service';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const dashboardService: DashboardService = ctx.get(DashboardService);
  const success = await dashboardService.addUser('u1lQsNbW-staging', 'rogier.simonse@mistergreen.nl', 'yannick@mistergreen.nl');
  process.exit(0);

})();
