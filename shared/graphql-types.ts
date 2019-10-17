
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface BlockInput {
    name: string;
    uptimecheck?: UptimeCheckInput;
    buttons?: ButtonInput[];
}

export interface ButtonInput {
    label?: string;
    url?: string;
}

export interface DashboardInput {
    name?: string;
}

export interface HourRangeInput {
    from?: number;
    to?: number;
}

export interface UptimeCheckInput {
    url: string;
    disabledHours?: HourRangeInput;
    interval: number;
    webhook?: string;
}

export interface GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Block extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    url?: string;
    uptime?: Uptime;
    buttons?: Button[];
}

export interface Button extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    label?: string;
    url?: string;
}

export interface Dashboard extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    description?: string;
    blocks?: Block[];
}

export interface HourRange {
    from?: number;
    to?: number;
}

export interface IMutation {
    createDashboard(input?: DashboardInput): Dashboard | Promise<Dashboard>;
    addBlock(dashboardId: string, input?: BlockInput): Dashboard | Promise<Dashboard>;
    removeBlock(dashboardId: string, blockId: string): Dashboard | Promise<Dashboard>;
}

export interface Plan extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    maxDashboards?: number;
    maxBlocks?: number;
    maxUptimeInterval?: number;
    maxMembers?: number;
    webhookNotifications?: boolean;
}

export interface IQuery {
    Dashboard(id?: string): Dashboard | Promise<Dashboard>;
    Me(): User | Promise<User>;
}

export interface Uptime extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    checkInterval?: number;
    webhook?: string;
    disabledHours?: HourRange;
    stats?: UptimeStats;
}

export interface UptimeStats extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    ms0_100?: number;
    ms100_500?: number;
    ms500_1?: number;
    s1?: number;
    error?: number;
}

export interface User extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLogin?: Date;
    email?: string;
    firstname?: string;
    familyname?: string;
    picture?: string;
    dashboards?: Dashboard[];
    plan?: Plan;
}
