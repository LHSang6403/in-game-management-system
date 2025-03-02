import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserModule } from '@modules/user/user.module';
import { RedisModule } from '@modules/redis/redis.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLLoggerMiddleware } from 'src/middlewares/graphql-logger.middleware';

@Module({
  imports: [
    UserModule,
    RedisModule,
    OrganizationModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/graphql',
      introspection: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      context: ({ req }) => ({ req }),
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GraphQLLoggerMiddleware).forRoutes('/graphql');
  }
}
