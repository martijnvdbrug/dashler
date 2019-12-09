import gql from 'graphql-tag';


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
        }
    }`;
