import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {DashboardModule} from './dashboard/dashboard.module';
import {InterfaceResolver} from './interface.resolver';
import {AuthModule} from './auth/auth.module';
import {AuthenticatedDirective} from './auth/authenticated.directive';

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
    InterfaceResolver
  ]
})
export class AppModule {
}
