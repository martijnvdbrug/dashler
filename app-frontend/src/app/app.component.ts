import {Component, OnInit} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {interval, Observable} from 'rxjs';
import {Dashboard} from '../shared/graphql-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashler';
  dashboard$: Observable<Dashboard>;

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboard$ = this.dashboardService.getDashboard('d8baa7f0-dee1-11e9-b210-954ed90bb797');
  }

}
