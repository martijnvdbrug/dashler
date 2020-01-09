import {NestFactory} from '@nestjs/core';
import {AppModule} from '../src/app/app.module';
import {GraphQLModule} from '@nestjs/graphql';

// const { query, mutate } = createTestClient(server);

describe('Init', () => {

  test('Testclient', async () => {
    const ctx = await NestFactory.create(AppModule);
  });

});
