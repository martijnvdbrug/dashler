import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {DashboardModule} from './dashboard/dashboard.module';
import {InterfaceResolver} from './interface.resolver';
import {AuthModule} from './auth/auth.module';
import {AuthenticatedDirective} from './auth/authenticated.directive';
import {UserResolver} from './resolvers/user.resolver';
import {QueryResolver} from './resolvers/query.resolver';
import {MutationResolver} from './resolvers/mutation.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./dist/**/*.graphql'],
      formatError: (err) => {
        console.error(err);
        return err;
      },
      schemaDirectives: {
        authenticated: AuthenticatedDirective
      },
      context: ({ req }) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';
        return { token };
      }
    }),
    DashboardModule,
    AuthModule,
  ],
  providers: [
    InterfaceResolver,
    QueryResolver,
    MutationResolver,
    UserResolver,
  ]
})
export class AppModule {
}
