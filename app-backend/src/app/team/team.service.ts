import {Inject, Injectable} from '@nestjs/common';
import {TeamEntity} from './model/team.entity';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Plan} from '../../lib/shared/graphql-types';
import {readableId} from '../../lib/readable-id';
import {Plans} from '../plan/plans';

@Injectable()
export class TeamService {

  constructor(
    @Inject('TeamRepo') private teamRepo: DatastoreClient<TeamEntity>
  ) {
  }

  async get(id: string): Promise<TeamEntity> {
    if (!id) {
      throw Error(`Need ID to get a team`);
    }
    const team = await this.teamRepo.get(id);
    if (!team) {
      throw Error(`No team exists with id ${id}`);
    }
    return team;
  }

  async create(email: string, plan: Plan): Promise<TeamEntity> {
    const id = readableId(`team-${email}`);
    await this.teamRepo.save({
      id,
      memberIds: [email],
      plan,
      dashboardIds: []
    });
    return this.get(id);
  }

  async addMember(teamId: string, email: string): Promise<TeamEntity> {
    const team = await this.get(teamId);
    if (!team.memberIds || !Array.isArray(team.memberIds)) {
      team.memberIds = [];
    }
    team.memberIds.push(email);
    return this.get(teamId);
  }

  async removeMember(teamId: string, email: string): Promise<TeamEntity> {
    const team = await this.get(teamId);
    if (!team.memberIds || !Array.isArray(team.memberIds)) {
      team.memberIds = [];
    }
    team.memberIds = team.memberIds.filter(id => id !== email);
    return this.get(teamId);
  }

  async addDashboard(teamId: string, dashboardId: string | string[]): Promise<TeamEntity> {
    const team = await this.get(teamId);
    if (!team.dashboardIds || !Array.isArray(team.dashboardIds)) {
      team.dashboardIds = [];
    }
    if (Array.isArray(dashboardId)) {
      team.dashboardIds = team.dashboardIds.concat(dashboardId);
    } else {
      team.dashboardIds.push(dashboardId);
    }
    team.dashboardIds = [...new Set(team.dashboardIds)];
    await this.teamRepo.update(teamId, team);
    return this.get(teamId);
  }

  async removeDashboard(teamId: string, dashboardId: string): Promise<TeamEntity> {
    const team = await this.get(teamId);
    if (!team.dashboardIds || !Array.isArray(team.dashboardIds)) {
      team.dashboardIds = [];
    }
    team.dashboardIds = team.dashboardIds.filter(id => id !== dashboardId);
    await this.teamRepo.update(teamId, team);
    return this.get(teamId);
  }

  async upgradeToPROPlan(teamId: string): Promise<TeamEntity> {
    const team = await this.get(teamId);
    await this.teamRepo.update(teamId, {
      ...team,
      plan: Plans.getPROPlan(teamId)
    });
    return this.get(teamId);
  }

  async remove(teamId: string): Promise<boolean> {
    await this.teamRepo.remove(teamId);
    return true;
  }
}


