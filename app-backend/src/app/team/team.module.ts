import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Team} from '../../lib/shared/graphql-types';
import {TeamEntity} from './model/team.entity';

@Module({
  providers: [
    TeamService,
    {
      provide: 'TeamRepo',
      useValue: new DatastoreClient<TeamEntity>('Team')
    }
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}
