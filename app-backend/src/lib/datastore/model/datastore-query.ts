import {Operator} from '@google-cloud/datastore/build/src/query';

export interface DatastoreQuery {
  property: string,
  operator: Operator,
  value: {}
}
