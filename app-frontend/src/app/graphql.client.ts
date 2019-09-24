import { Injectable } from '@angular/core';
import ApolloClient from 'apollo-boost';

@Injectable({
  providedIn: 'root'
})
export class GraphqlClient extends ApolloClient<unknown> {

  constructor() {
    super({
      uri: 'http://localhost:8999/graphql',
    });
  }
}
