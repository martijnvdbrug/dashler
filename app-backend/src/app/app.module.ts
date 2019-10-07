import {Module} from '@nestjs/common';
import {GraphQLModule} from '@nestjs/graphql';
import {DashboardModule} from './dashboard/dashboard.module';
import {InterfaceResolver} from './interface.resolver';
import {AuthModule} from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./dist/**/*.graphql'],
      formatError: (err) => {
        console.error(err);
        return err;
      },
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
