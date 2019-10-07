import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

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
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const jwt = params.get('jwt');
      if (jwt) {
        localStorage.setItem('token', jwt);
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/login/error']);
      }
    });
  }


}
