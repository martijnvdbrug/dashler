import {Injectable} from '@angular/core';
import {JwtPayload} from '../../shared/jwt.payload';
import {User} from '../../shared/graphql-types';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {getMeQuery} from './user.queries';
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

  getUser(): Observable<User> {
    return this.apollo.watchQuery<any>({
      query: getMeQuery,
    }).valueChanges
      .pipe(map(result => result.data.getMe));
  }

}
