import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  environment = environment;
  error: string;

  constructor(
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.pathFromRoot[1].url.subscribe(val => {
      if (val[1].path === 'error') {
        this.error = 'Unable to login, please try again';
      }
    });
  }

}
