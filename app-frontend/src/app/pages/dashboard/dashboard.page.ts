import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DashboardService} from '../../providers/dashboard.service';
import {combineLatest, Observable} from 'rxjs';
import {ButtonInput, Dashboard, HourRange, Plan, Team, UptimeCheckInput, User} from '../../../lib/shared/graphql-types';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../providers/user.service';
import {ApolloError} from 'apollo-angular-boost';
import {environment} from '../../../environments/environment';
import {TeamService} from '../../providers/team.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  loading = true;
  isPro = false;
  dashboard$: Observable<Dashboard>;
  environment = environment;
  allDashboards$: Observable<Dashboard[]>;
  user$: Observable<User>;
  team$: Observable<Team>;
  plan$: Observable<Plan>;
  teamMembers: User[];
  dashboardId: string;
  subscriptionMessage: string;
  addBlockForm = new FormGroup({
    name: new FormControl(),
    uptimeCheck: new FormControl(),
    uptimeUrl: new FormControl(),
    uptimeDisabledHours: new FormControl(),
    disableFrom: new FormControl(),
    disableTo: new FormControl(),
    uptimeInterval: new FormControl(),
    uptimeWebhook: new FormControl(),
    button1Label: new FormControl(),
    button1Url: new FormControl(),
    button2Label: new FormControl(),
    button2Url: new FormControl(),
    button3Label: new FormControl(),
    button3Url: new FormControl(),
  });
  addDashboardForm = new FormGroup({
    name: new FormControl()
  });

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private userService: UserService,
    private teamService: TeamService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.dashboard$ = this.dashboardService.get(params.get('id'));
      this.dashboard$.subscribe(d => {
        if (d) {
          this.dashboardId = d.id;
          this.location.go(`/dashboard/${d.id}`);
        }
        this.loading = false;
      });
    });
    this.user$ = this.userService.getUser();
    this.team$ = this.teamService.getTeam();
    this.allDashboards$ = this.team$.pipe(map(team => team.dashboards));
    this.plan$ = this.team$.pipe(map(team => team.plan));
    this.plan$.subscribe(plan => this.isPro = plan.maxMembers > 1);
    combineLatest(this.user$, this.team$).subscribe(([user, team]) => { // filter currentuser from teammembers
      this.teamMembers = team.members.filter(m => m.email !== user.email);
    });
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
      const disabledHours: HourRange = this.createDisabledHours();
      const uptimecheck: UptimeCheckInput = this.addBlockForm.value.uptimeCheck ? {
        disabledHours,
        interval: this.addBlockForm.value.uptimeInterval ? this.addBlockForm.value.uptimeInterval : 60,
        url: this.addBlockForm.value.uptimeUrl,
        webhook: this.addBlockForm.value.uptimeWebhook,
      } : undefined;
      await this.dashboardService.addBlock(this.dashboardId, {
        name: this.addBlockForm.value.name,
        uptimecheck,
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

  /**
   * Create timezone dependant date from hours
   */
  createDisabledHours(): HourRange {
    if (!this.addBlockForm.value.uptimeDisabledHours) {
      return undefined;
    }
    const from = new Date();
    from.setHours(this.addBlockForm.value.disableFrom);
    const to = new Date();
    to.setHours(this.addBlockForm.value.disableTo);
    return {
      from,
      to,
    };
  }

  async createDashboard() {
    try {
      await this.dashboardService.createDashboard({
        name: this.addDashboardForm.value.name,
      });
      this.addDashboardForm.reset();
    } catch (e) {
      if (e instanceof ApolloError && (e as ApolloError).graphQLErrors[0].extensions.code === 'NotInPlanException') {
        this.showSubcribeModal(e.graphQLErrors[0].message);
      } else {
        throw e;
      }
    }
  }

}
