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

export const getUserQuery = gql`
    ${userFields}
    query User {
        User {
            ...userFields
        }
    }`;

export const getStripeSessionIdQuery = gql`
    query StripeSessionId {
        StripeSessionId
    }`;

