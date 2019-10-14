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
            responseTime {
                id
                createdAt
                updatedAt
                ms0_100
                ms100_500
                s1
                error
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
