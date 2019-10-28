import {NotInPlanException} from './not-in-plan.exception';
import {Block, Dashboard, Plan, UptimeCheckInput} from '../../lib/shared/graphql-types';

export class PlanValidator {

  static validateMembers(users: string[], plan: Plan): void {
    if (users.length >= plan.maxMembers) {
      throw new NotInPlanException(`You are only allowed to have ${plan.maxMembers} team members.`);
    }
  }

  static validateBlocks(blocks: Block[], plan: Plan): void {
    if (blocks.length >= plan.maxBlocks) {
      throw new NotInPlanException(`You are only allowed to have ${plan.maxBlocks} blocks in you dashboard.`);
    }
  }

  static validateDashboards(dashboards: Dashboard[] | string[], plan: Plan): void {
    if (dashboards.length >= plan.maxDashboards) {
      throw new NotInPlanException(`You are only allowed to have ${plan.maxDashboards} dashboards.`);
    }
  }

  static validateUptime(uptime: UptimeCheckInput, plan: Plan): void {
    if (uptime.interval < plan.maxUptimeInterval) {
      throw new NotInPlanException(`The max uptime interval is ${plan.maxUptimeInterval} minutes.`);
    } else if (uptime.webhook && !plan.webhookNotifications) {
      throw new NotInPlanException(`You are not allowed to have webhook notifications.`);
    }
  }

}
