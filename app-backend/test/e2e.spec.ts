import {createTestClient} from 'apollo-server-testing';
import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {GraphQLModule} from '@nestjs/graphql';

// const { query, mutate } = createTestClient(server);

describe('Init', () => {

  test('Testclient', async () => {
    const ctx = await NestFactory.create(AppModule);
    const graphqlModule: GraphQLModule = ctx.get(GraphQLModule);
    console.log((graphqlModule as any));
    const {query, mutate} = createTestClient((module as any).apolloServer);
  });

});
