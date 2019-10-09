import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable, OnInit} from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import {JwtPayload} from '../../lib/shared/jwt.payload';
import {UserService} from '../providers/user.service';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    }
    // navigate to login page
    this.router.navigate(['/login']);
    // you can save redirect url so after authing we can move them back to the page they requested
    return false;
  }

}
