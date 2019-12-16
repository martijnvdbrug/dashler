import {Inject, Injectable} from '@nestjs/common';
import {UserEntity} from './model/user.entity';
import {UserInput} from './model/user.input';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {AuthUtil} from './auth.util';
import {Plans} from '../plan/plans';
import {TeamService} from '../team/team.service';
import {TeamEntity} from '../team/model/team.entity';
import {DashboardService} from '../dashboard/dashboard.service';

@Injectable()
export class UserService {

  constructor(
    private teamService: TeamService,
    private dashboardService: DashboardService,
    @Inject('UserRepo') private userRepo: DatastoreClient<UserEntity>,
  ) {
  }

  static isAdmin(email: string): boolean {
    return email === 'martijn.brug@gmail.com';
  }

  async create(input: UserInput): Promise<UserEntity> {
    if (!input.email) {
      throw Error(`Cannot signup user without email. Given: ${JSON.stringify(input)}`);
    }
    if (!input.teamId) {
      const {id} = await this.teamService.create(input.email, Plans.getDefaultPlan(input.email));
      input.teamId = id;
    }
    const user: UserEntity = {
      id: input.email,
      email: input.email,
      firstname: input.firstname,
      familyname: input.familyname,
      locale: input.locale,
      originId: input.originId,
      picture: input.picture,
      lastLogin: new Date(),
      provider: input.provider,
      teamId: input.teamId
    };
    await this.userRepo.save(user);
    return this.get(input.email);
  }

  async get(email: string): Promise<UserEntity> {
    if (!email) {
      throw Error(`Need email to get a user`);
    }
    const user = await this.userRepo.get(email);
    if (!user) {
      throw Error(`User ${email} doesn't exist`);
    }
    return user;
  }

  async login(input: UserInput): Promise<string> {
    const user = await this.get(input.email);
    await this.userRepo.update(input.email, { // Update data when login
      ...user,
      firstname: input.firstname,
      familyname: input.familyname,
      locale: input.locale,
      originId: input.originId,
      picture: input.picture,
      provider: input.provider,
      lastLogin: new Date()
    });
    return AuthUtil.generateJWT(input.email, user.teamId);
  }

  /**
   * SignUp new user, or login if already exists
   */
  async signUpOrLogin(user: UserInput): Promise<string> {
    if (!user.email) {
      throw Error(`Cannot signup user without email. Given: ${JSON.stringify(user)}`);
    }
    if (await this.userRepo.exists(user.email)) {
      return this.login(user);
    }
    await this.create(user);
    return AuthUtil.generateJWT(user.email, user.teamId);
  }

  async addToTeam(email: string, newTeamId: string): Promise<TeamEntity> {
    const user = await this.get(email).catch(() => undefined);
    if (user) { // Copy existing dashboards and update user.teamId
      const oldTeam = user.teamId;
      if (oldTeam === newTeamId) {
        throw Error(`${email} is already in team ${newTeamId}`);
      }
      await this.teamService.remove(oldTeam);
      const oldDashboards = oldTeam ? await this.dashboardService.getForTeam(oldTeam) : [];
      await this.teamService.addDashboard(newTeamId, oldDashboards.map(d => d.id));
      user.teamId = newTeamId;
      await this.userRepo.update(email, user);
    } else { // create new User with new teamId
      await this.create({
        email,
        teamId: newTeamId
      });
    }
    return this.teamService.get(newTeamId);
  }

  async removeFromTeam(email: string, teamId: string): Promise<TeamEntity> {
    const user = await this.get(email);
    const {id: newTeamId} = await this.teamService.create(email, Plans.getDefaultPlan(email));
    user.teamId = newTeamId;
    await this.userRepo.update(email, user);
    return this.teamService.get(teamId);
  }

  async getForTeam(team): Promise<UserEntity[]> {
    return this.userRepo.query({
      property: 'teamId',
      operator: '=',
      value: team
    });
  }

}
