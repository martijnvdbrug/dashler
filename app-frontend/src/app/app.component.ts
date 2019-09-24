import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {DashboardService} from './dashboard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashler';

  constructor(
    private dashboardService: DashboardService
  ){}

  ngOnInit(): void {
    this.dashboardService.getDashboard('d8baa7f0-dee1-11e9-b210-954ed90bb797');
  }

}
