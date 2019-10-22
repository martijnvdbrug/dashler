import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DashboardService} from '../src/app/dashboard/dashboard.service';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const dashboardService: DashboardService = ctx.get(DashboardService);
  await dashboardService.create({name: 'test'}, 'martijn@mistergreen.nl');

  process.exit(0);

})();
