import {Inject, Injectable} from '@nestjs/common';
import {UserEntity} from './model/user.entity';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {UserInput} from './model/user.input';
import * as jwt from 'jsonwebtoken';
import {JwtPayload} from '../../lib/shared/jwt.payload';
import {CONFIG} from '../../lib/config/config';

@Injectable()
export class AuthService {

  constructor(
    @Inject('UserRepo') private userRepo: DatastoreClient<UserEntity>
  ) {
  }

  static decode(tokenOrHeader: string): JwtPayload {
    if (tokenOrHeader && tokenOrHeader.toLowerCase().startsWith('bearer ')) {
      tokenOrHeader = tokenOrHeader.replace('bearer ', '');
      tokenOrHeader = tokenOrHeader.replace('Bearer ', '');
    }
    return jwt.verify(tokenOrHeader, CONFIG.jwtSecret, {ignoreExpiration: false}) as JwtPayload;
  }

  async get(email: string): Promise<UserEntity> {
    const user = this.userRepo.get(email);
    if (!user) {
      throw Error(`User ${email} doesn't exist`);
    }
    return user;
  }

  async login(email: string): Promise<string> {
    const user = await this.get(email);
    await this.userRepo.save({
      ...user,
      lastLogin: new Date()
    });
    return this.generateJWT(email);
  }

  /**
   * SignUp new user, or login if already exists
   */
  async signUpOrLogin(user: UserInput): Promise<string> {
    if (!user.email) {
      throw Error(`Cannot signup user without email. Given: ${JSON.stringify(user)}`);
    }
    if (await this.userRepo.exists(user.email)) {
      return this.login(user.email);
    }
    await this.userRepo.save({
      id: user.email,
      email: user.email,
      firstname: user.firstname,
      familyname: user.familyname,
      locale: user.locale,
      originId: user.originId,
      picture: user.picture,
      lastLogin: new Date()
    });
    return this.generateJWT(user.email);
  }

  async addDashboard(email: string, dashboardId: string): Promise<boolean> {
    const user = await this.get(email);
    if (!user.dashboardIds || !Array.isArray(user.dashboardIds)) {
      user.dashboardIds = [];
    }
    user.dashboardIds.push(dashboardId);
    await this.userRepo.save(user);
    return true;
  }

  private generateJWT(email: string): string {
    const payload: JwtPayload = {
      email,
      iat: Date.now()
    };
    return jwt.sign(payload, CONFIG.jwtSecret, {
      expiresIn: 30 * 24 * 60 * 60 * 1000
    });
  }

}
