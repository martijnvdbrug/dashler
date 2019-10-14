import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {DashboardService} from '../src/app/dashboard/dashboard.service';

(async () => {

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const dashboardService: DashboardService = ctx.get(DashboardService);
  await dashboardService.addUser('wSweXxDK-production-dashboard', 'rob@mistergreen.nl', 'martijn.brug@gmail.com');

  process.exit(0);

})();
