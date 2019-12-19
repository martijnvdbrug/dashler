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
                    ms0_500
                    ms500_1
                    s1_2
                    s2
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
    mutation addBlock($dashboardId: ID!, $input: BlockInput!) {
        addBlock(dashboardId: $dashboardId, input: $input) {
            ...dashboardFields
        }
    }`;

export const updateBlockMutation = gql`
    ${dashboardFields}
    mutation updateBlock($dashboardId: ID!, $blockId: ID!, $input: BlockInput!) {
        updateBlock(dashboardId: $dashboardId, blockId: $blockId, input: $input) {
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

export const createDashboardMutation = gql`
    ${dashboardFields}
    mutation createDashboard($input: DashboardInput!) {
        createDashboard(input: $input) {
            ...dashboardFields
        }
    }`;
