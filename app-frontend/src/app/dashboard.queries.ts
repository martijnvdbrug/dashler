import {gql} from 'apollo-angular-boost';

export const getDashboardQuery = gql`
    query DashBoard($id: ID!){
        Dashboard(id: $id){
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
        }
    }`;
