import { Injectable } from '@nestjs/common';
import {Team} from '../../lib/shared/graphql-types';

@Injectable()
export class TeamService {

  async addMember(email: string): Promise<Team> {
    return undefined;
  }

  async removeMember(email: string): Promise<Team> {
    return undefined;
  }

  async getTeamOfMember(email: string): Promise<Team | undefined> {
    return undefined;
  }
}


