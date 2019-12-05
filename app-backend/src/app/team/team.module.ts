import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import {DatastoreClient} from '../../lib/datastore/datastore.client';
import {Team} from '../../lib/shared/graphql-types';

@Module({
  providers: [
    TeamService,
    {
      provide: 'TeamRepo',
      useValue: new DatastoreClient<Team>('Team')
    }
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}
