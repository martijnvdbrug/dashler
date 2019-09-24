
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface BlockInput {
    name?: string;
    buttons?: ButtonInput[];
}

export interface ButtonInput {
    label?: string;
    url?: string;
}

export interface DashboardInput {
    name?: string;
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
    responseTime?: ResponseTime;
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

export interface IMutation {
    createDashboard(input?: DashboardInput): Dashboard | Promise<Dashboard>;
    addBlock(input?: BlockInput): Dashboard | Promise<Dashboard>;
}

export interface IQuery {
    Dashboard(id: string): Dashboard | Promise<Dashboard>;
}

export interface ResponseTime extends GraphqlNode {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    ms0_100?: number;
    ms100_500?: number;
    s1?: number;
    error?: number;
}
