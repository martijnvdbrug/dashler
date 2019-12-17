import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DashboardService} from '../../providers/dashboard.service';
import {combineLatest, Observable} from 'rxjs';
import {Block, Dashboard, Plan, Team, User} from '../../../lib/shared/graphql-types';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../providers/user.service';
import {ApolloError} from 'apollo-angular-boost';
import {environment} from '../../../environments/environment';
import {TeamService} from '../../providers/team.service';
import {map} from 'rxjs/operators';
import {AddBlockFormgroup} from '../../components/add-block/add-block.formgroup';

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
  addBlockForm = new AddBlockFormgroup();
  addDashboardForm = new FormGroup({
    name: new FormControl()
  });
  addMemberForm = new FormGroup({
    email: new FormControl()
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
    try {
      await this.dashboardService.addBlock(this.dashboardId, this.addBlockForm.getBlockInput());
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

  async addMember(): Promise<void> {
    try {
      await this.teamService.addMember(this.addMemberForm.value.email);
      this.addMemberForm.reset();
    } catch (e) {
      if (e instanceof ApolloError && (e as ApolloError).graphQLErrors[0].extensions.code === 'NotInPlanException') {
        this.showSubcribeModal(e.graphQLErrors[0].message);
      } else {
        throw e;
      }
    }
  }

  async removeMember(email: string, event: Event): Promise<void> {
    event.preventDefault();
    await this.teamService.removeMember(email);
  }

  async editBlock(block: Block) {
    this.addBlockForm.setValues(block);
    document.getElementById('addBlockButton').click();
  }

}
