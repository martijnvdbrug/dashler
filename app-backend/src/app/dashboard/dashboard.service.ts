import {ForbiddenException, Inject, Injectable} from '@nestjs/common';
import {BlockInput, DashboardInput} from '../../lib/shared/graphql-types';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {DashboardAdapter} from './dashboard.adapter';
import {DashboardEntity} from './model/dashboard.entity';
import {readableId} from '../../lib/readable-id';
import {PlanValidator} from '../plan/plan.validator';
import {UptimeService} from './uptime.service';
import {TeamService} from '../team/team.service';
import {TeamEntity} from '../team/model/team.entity';


@Injectable()
export class DashboardService {

  constructor(
    private uptimeService: UptimeService,
    private teamService: TeamService,
    @Inject('DashboardRepo') private dashboardRepo: DatastoreClient<DashboardEntity>,
  ) {
  }

  /**
   * Gets dashboard by id. Validates if it belongs to team if a teamId is given.
   */
  async get(id: string, teamId?: string): Promise<DashboardEntity> {
    const dashboard = await this.dashboardRepo.get(id);
    if (!dashboard) {
      throw Error(`Dashboard ${id} not found.`);
    }
    if (!teamId) {
      return dashboard;
    }
    if (dashboard.teamId !== teamId) {
      throw new ForbiddenException(`You are not allowed to view/edit this dashboard`);
    }
    return dashboard;
  }

  async create(input: DashboardInput, teamId: string): Promise<DashboardEntity> {
    const team = await this.teamService.get(teamId);
    PlanValidator.validateDashboards(team.dashboardIds, team.plan);
    const id = readableId(input.name);
    await Promise.all([
      this.dashboardRepo.save({
        id,
        name: input.name,
        teamId
      }),
      this.teamService.addDashboard(teamId, id)
    ]);
    return this.get(id);
  }

  async remove(id: string, teamId: string): Promise<boolean> {
    const dashboard = await this.get(id, teamId);
    const blocks = dashboard.blocks ? dashboard.blocks : [];
    await Promise.all(blocks.map(block => this.uptimeService.remove(block.url)));
    await this.teamService.removeDashboard(dashboard.teamId, id);
    await this.dashboardRepo.remove(id);
    return true;
  }

  async addBlock(dashboardId: string, input: BlockInput, teamId: string): Promise<DashboardEntity> {
    const [{plan}, dashboard]: [TeamEntity, DashboardEntity] = await Promise.all([
      this.teamService.get(teamId),
      this.get(dashboardId, teamId)
    ]);
    if (!Array.isArray(dashboard.blocks)) {
      dashboard.blocks = [];
    }
    PlanValidator.validateBlocks(dashboard.blocks, plan);
    let createUptimePromise;
    if (input.uptimecheck) {
      PlanValidator.validateUptime(input.uptimecheck, plan);
      createUptimePromise = this.uptimeService.create(input.uptimecheck);
    }
    dashboard.blocks.push(DashboardAdapter.toBlock(input));
    await Promise.all([
      createUptimePromise,
      this.dashboardRepo.save(dashboard)
    ]);
    return dashboard;
  }

  async updateBlock(dashboardId: string, blockId: string, input: BlockInput, teamId: string): Promise<DashboardEntity> {
    const [{plan}, dashboard]: [TeamEntity, DashboardEntity] = await Promise.all([
      this.teamService.get(teamId),
      this.get(dashboardId, teamId)
    ]);
    if (!Array.isArray(dashboard.blocks)) {
      dashboard.blocks = [];
    }
    const existingBlock = dashboard.blocks.find(block => block.id === blockId);
    if (!existingBlock) {
      throw Error(`Cannot update block ${blockId}, because it doesn't exists for dashboard ${dashboard}.`);
    }
    let createUptimePromise;
    if (input.uptimecheck) {
      PlanValidator.validateUptime(input.uptimecheck, plan);
      createUptimePromise = this.uptimeService.create(input.uptimecheck);
    }
    dashboard.blocks = dashboard.blocks.filter(block => block.id !== blockId);
    dashboard.blocks.push(DashboardAdapter.toBlock(input, blockId));
    await Promise.all([
      createUptimePromise,
      this.dashboardRepo.save(dashboard)
    ]);
    return dashboard;
  }

  async removeBlock(dashboardId: string, blockId: string, teamId: string): Promise<DashboardEntity> {
    const dashboard = await this.get(dashboardId, teamId);
    if (!Array.isArray(dashboard.blocks)) {
      return dashboard;
    }
    const block = dashboard.blocks.find(b => b.id === blockId);
    if (block) {
      await this.uptimeService.remove(block.url);
    }
    dashboard.blocks = dashboard.blocks.filter(b => b.id !== blockId);
    await this.dashboardRepo.save(dashboard);
    return dashboard;
  }

  async getFirstForTeam(teamId: string): Promise<DashboardEntity> {
    const dashboards = await this.getForTeam(teamId);
    return dashboards[0];
  }

  async getForTeam(teamId: string): Promise<DashboardEntity[]> {
    return this.dashboardRepo.query({
      property: 'teamId',
      operator: '=',
      value: teamId
    });
  }

}
