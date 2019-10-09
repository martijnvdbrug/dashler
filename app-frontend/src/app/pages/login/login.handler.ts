import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../providers/user.service';

@Component({
  selector: 'login-handler',
  template: '<p>redirecting...</p>',
})
/**
 * Component just for storing JWT and redirecting
 */
export class LoginHandler implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const jwt = params.get('jwt');
      this.userService.login(jwt);
    });
  }


}
