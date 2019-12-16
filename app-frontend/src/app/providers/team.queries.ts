import gql from 'graphql-tag';
import {dashboardFields} from './dashboard.queries';


export const getTeamWithDashboardsAndPlan = gql`
    query Team {
        Team {
            id
            dashboards {
                id
                name
            }
            plan {
                id
                maxBlocks
                maxDashboards
                maxMembers
                maxUptimeInterval
            }
            members {
                id
                email
                picture
                firstname
            }
        }
    }`;

export const addMemberMutation = gql`
    mutation addMember($userId: ID!) {
        addMember(userId: $userId) {
            id
            members {
                id
                email
                picture
                firstname
            }
        }
    }`;

export const removeMemberMutation = gql`
    mutation removeMember($userId: ID!) {
        removeMember(userId: $userId) {
            id
            members {
                id
                email
                picture
                firstname
            }
        }
    }`;
