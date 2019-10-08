import {gql} from 'apollo-angular-boost';

export const userFields = gql`
    fragment userFields on User {
        id
        createdAt
        updatedAt
        email
        familyname
        firstname
        lastLogin
        picture
    }`;

export const getMeQuery = gql`
    ${userFields}
    query Me {
        Me {
            ...userFields
        }
    }`;

export const getMeWithDashboardQuery = gql`
    ${userFields}
    query Me {
        Me {
            ...userFields
            dashboards {
                id
                name
                createdAt
                updatedAt
            }
        }
    }`;

