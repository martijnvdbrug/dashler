import {Injectable} from '@angular/core';
import {JwtPayload} from '../../lib/shared/jwt.payload';
import {User} from '../../lib/shared/graphql-types';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {getStripeSessionIdQuery, getUserQuery} from './user.queries';
import {Apollo} from 'apollo-angular-boost';
import {Router} from '@angular/router';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class UserService {

  private decodedJwt: JwtPayload;

  constructor(
    private apollo: Apollo,
    private router: Router
  ) {
  }

  getUser(): Observable<User> {
    return this.apollo.watchQuery<any>({
      query: getUserQuery,
    }).valueChanges
      .pipe(
        catchError((e) => this.errorAndLogout(e)),
        map(result => result.data.Me));
  }

  async getStripeSessionId(): Promise<string> {
    const {data: {StripeSessionId}} = await this.apollo.query<any>({
      query: getStripeSessionIdQuery,
    }).toPromise() as any;
    return StripeSessionId;
  }

  errorAndLogout(e): Observable<any> {
    this.logout();
    return Observable.throw(`Error getting User with dashboards`, e);
  }

  logout() {
    this.decodedJwt = undefined;
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  login(token: string) {
    if (token) {
      this.decodedJwt = jwt_decode(token);
      localStorage.setItem('token', token);
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login/error']);
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

}
