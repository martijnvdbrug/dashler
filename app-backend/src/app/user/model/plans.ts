import {Plan} from '../../../../../shared/graphql-types';
import {readableId} from '../../../lib/readable-id';

export class Plans {


  static getDefaultPlan(email: string): Plan {
    return {
      id: readableId(email),
      createdAt: new Date(),
      updatedAt: new Date(),
      maxBlocks: 9,
      maxDashboards: 1,
      maxUptimeInterval: 60,
      maxMembers: 1,
    };
  }

  static getPROPlan(email: string): Plan {
    return {
      id: readableId(email),
      createdAt: new Date(),
      updatedAt: new Date(),
      maxBlocks: 50,
      maxDashboards: 5,
      maxUptimeInterval: 5,
      maxMembers: 5,
    };
  }
}
