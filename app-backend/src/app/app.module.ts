import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {DashboardModule} from './dashboard/dashboard.module';
import {InterfaceResolver} from './interface.resolver';
import {UserModule} from './user/user.module';
import {AuthenticatedDirective} from './user/authenticated.directive';
import {QueryResolver} from './query.resolver';
import {MutationResolver} from './mutation.resolver';
import {PaymentModule} from './payment/payment.module';
import {TeamModule} from './team/team.module';

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
      context: ({req}) => {
        // get the user token from the headers
        const token = req.headers.authorization || '';
        return {token};
      },
      introspection: true,
      playground: true
    }),
    DashboardModule,
    UserModule,
    PaymentModule,
    TeamModule,
  ],
  providers: [
    InterfaceResolver,
    QueryResolver,
    MutationResolver,
  ]
})
export class AppModule {
}
