import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DashboardService} from '../../providers/dashboard.service';
import {Observable} from 'rxjs';
import {ButtonInput, Dashboard} from '../../../../../shared/graphql-types';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../providers/user.service';
import {User} from '../../../lib/shared/graphql-types';
import {map} from 'rxjs/operators';
import {ApolloError} from 'apollo-angular-boost';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  loading = true;
  dashboard$: Observable<Dashboard>;
  environment = environment;
  /**
   * AllDashboards only incudes names and ID's in this context
   */
  allDashboards$: Observable<Dashboard[]>;
  user$: Observable<User>;
  dashboardId: string;
  subscriptionMessage: string;
  addBlockForm = new FormGroup({
    name: new FormControl(),
    url: new FormControl(),
    button1Label: new FormControl(),
    button1Url: new FormControl(),
    button2Label: new FormControl(),
    button2Url: new FormControl(),
    button3Label: new FormControl(),
    button3Url: new FormControl(),
  });

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private userService: UserService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dashboard$ = this.dashboardService.get(params.get('id'));
      this.dashboard$.subscribe(d => {
        this.dashboardId = d.id;
        this.location.go(`/dashboard/${d.id}`);
        this.loading = false;
      });
    });
    this.user$ = this.userService.getMeWithDasboards();
    this.allDashboards$ = this.user$.pipe(map(user => user.dashboards));
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
    try {
      await this.dashboardService.addBlock(this.dashboardId, {
        name: this.addBlockForm.value.name,
        url: this.addBlockForm.value.url,
        buttons
      });
      this.addBlockForm.reset();
    } catch (e) {
      if (e instanceof ApolloError && (e as ApolloError).graphQLErrors[0].extensions.code === 'NotInPlanException') {
        this.showSubcribeModal(e.graphQLErrors[0].message);
      } else {
        throw e;
      }
    }
  }

  showSubcribeModal(message: string) {
    this.subscriptionMessage = message;
    document.getElementById('openSubscribeModal').click();
  }

  toggleUptime(checked) {
    document.getElementById('add-block-uptime').hidden = !checked;
  }
  toggleDisableHours(checked) {
    document.getElementById('disabled-hours').hidden = !checked;
  }

  isActive(id: string): boolean {
    return this.dashboardId === id;
  }

  logout() {
    this.userService.logout();
  }

  isPro(): boolean {
    return false;
  }

}
