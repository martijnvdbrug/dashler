import gql from 'graphql-tag';

export const dashboardFields = gql`
    fragment dashboardFields on Dashboard {
        id
        createdAt
        updatedAt
        name
        description
        blocks {
            id
            createdAt
            updatedAt
            name
            url
            uptime {
                id
                createdAt
                updatedAt
                checkInterval
                webhook
                stats {
                    ms0_100
                    ms100_500
                    s1
                    error
                }
                disabledHours {
                    from
                    to
                }
            }
            buttons {
                label
                url
            }
        }
    }`;

export const getDashboardQuery = gql`
    ${dashboardFields}
    query DashBoard($id: ID) {
        Dashboard(id: $id){
            ...dashboardFields
        }
    }`;

export const addBlockMutation = gql`
    ${dashboardFields}
    mutation addBlock($dashboardId: ID!, $input: BlockInput) {
        addBlock(dashboardId: $dashboardId, input: $input) {
            ...dashboardFields
        }
    }`;

export const removeBlockMutation = gql`
    ${dashboardFields}
    mutation removeBlock($dashboardId: ID!, $blockId: ID!) {
        removeBlock(dashboardId: $dashboardId, blockId: $blockId) {
            ...dashboardFields
        }
    }`;
