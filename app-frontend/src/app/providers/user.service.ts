import {Injectable} from '@angular/core';
import {JwtPayload} from '../../lib/shared/jwt.payload';
import {Dashboard, User} from '../../lib/shared/graphql-types';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {getMeQuery, getMeWithDashboardQuery} from './user.queries';
import {Apollo} from 'apollo-angular-boost';

@Injectable()
export class UserService {

  private jwt: JwtPayload;

  constructor(
    private apollo: Apollo
  ) {
  }

  setJwtPayload(jwt: JwtPayload): void {
    this.jwt = jwt;
  }

  getJwtPayload(): JwtPayload {
    if (this.jwt) {
      return this.jwt;
    }
  }

  getEmail(): string {
    if (this.jwt) {
      return this.jwt.email;
    }
  }

  getMe(): Observable<User> {
    return this.apollo.watchQuery<any>({
      query: getMeQuery,
    }).valueChanges
      .pipe(map(result => result.data.getMe));
  }

  getMeWithDasboards(): Observable<User> {
    return this.apollo.watchQuery<any>({
      query: getMeWithDashboardQuery,
    }).valueChanges
      .pipe(map(result => result.data.Me));
  }

}
