import {Component, OnInit} from '@angular/core';
import {DashboardService} from './dashboard.service';
import {Observable} from 'rxjs';
import {ButtonInput, Dashboard} from '../shared/graphql-types';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dashboardId = 'd8baa7f0-dee1-11e9-b210-954ed90bb797';
  dashboard$: Observable<Dashboard>;
  addBlockForm = new FormGroup({
    name: new FormControl(),
    button1Label: new FormControl(),
    button1Url: new FormControl(),
    button2Label: new FormControl(),
    button2Url: new FormControl(),
    button3Label: new FormControl(),
    button3Url: new FormControl(),
  });

  constructor(
    private dashboardService: DashboardService
  ) {
  }

  ngOnInit(): void {
    this.dashboard$ = this.dashboardService.getDashboard(this.dashboardId);
  }

  async addBlock(): Promise<void> {
    const buttons: ButtonInput[] = [];
    if (this.addBlockForm.value.button1Label) {
      buttons.push({
        label: this.addBlockForm.value.button1Label,
        url: this.addBlockForm.value.button1Url
      });
    }
    if (this.addBlockForm.value.button2Label) {
      buttons.push({
        label: this.addBlockForm.value.button2Label,
        url: this.addBlockForm.value.button2Url
      });
    }
    if (this.addBlockForm.value.button3Label) {
      buttons.push({
        label: this.addBlockForm.value.button3Label,
        url: this.addBlockForm.value.button3Url
      });
    }
    await this.dashboardService.addBlock(this.dashboardId, {
      name: this.addBlockForm.value.name,
      buttons
    });
  }

}
