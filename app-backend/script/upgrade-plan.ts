import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {TeamService} from '../src/app/team/team.service';
import {UserService} from '../src/app/user/user.service';

(async () => {

  const email = 'martijn@mistergreen.nl';

  require('dotenv').config();
  const ctx = await NestFactory.createApplicationContext(AppModule);
  const teamService: TeamService = ctx.get(TeamService);
  const userService: UserService = ctx.get(UserService);


  const user = await userService.get(email);
  const team = await teamService.upgradeToPROPlan(user.teamId);
  console.log(`Upgraded to PRO ${team.id}`);

  process.exit(0);

})();
