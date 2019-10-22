import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {UserEntity} from './model/user.entity';
import {UserInput} from './model/user.input';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {AuthUtil} from './auth.util';
import {DashboardService} from '../dashboard/dashboard.service';
import {Plan} from '../../lib/shared/graphql-types';
import {readableId} from '../../lib/readable-id';

@Injectable()
export class UserService {

  constructor(
    @Inject('UserRepo') private userRepo: DatastoreClient<UserEntity>,
    @Inject(forwardRef(() => DashboardService)) private dashboardService: DashboardService
  ) {
  }

  async create(input: UserInput): Promise<UserEntity> {
    if (!input.email) {
      throw Error(`Cannot signup user without email. Given: ${JSON.stringify(input)}`);
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
      dashboardIds: [],
      plan: this.getDefaultPlan(input.email)
    };
    await this.userRepo.save(user);
    return user;
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
    await this.userRepo.save({ // Update data when login
      ...user,
      firstname: input.firstname,
      familyname: input.familyname,
      locale: input.locale,
      originId: input.originId,
      picture: input.picture,
      provider: input.provider,
      lastLogin: new Date()
    });
    return AuthUtil.generateJWT(input.email);
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
    return AuthUtil.generateJWT(user.email);
  }

  async addDashboard(email: string, dashboardId: string): Promise<boolean> {
    let user: UserEntity;
    try {
      user = await this.get(email);
    } catch (e) {
      this.create({ // Create empty user on invite, will be updated on login
        email
      });
    }
    if (!user.dashboardIds || !Array.isArray(user.dashboardIds)) {
      user.dashboardIds = [];
    }
    if (user.dashboardIds.indexOf(dashboardId) > -1) {
      return false;
    }
    user.dashboardIds.push(dashboardId);
    await this.userRepo.save(user);
    return true;
  }

  getDefaultPlan(email: string): Plan {
    return {
      id: readableId(email),
      createdAt: new Date(),
      updatedAt: new Date(),
      maxBlocks: 9,
      maxDashboards: 1,
      maxUptimeInterval: 60,
      maxMembers: 1,
    };
  }

}
