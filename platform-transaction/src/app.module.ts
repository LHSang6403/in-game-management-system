import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { ElasticsearchModule } from '@modules/elastic-search/elastic-search.module';
import { RabbitMQModule } from '@modules/rabbitmq/rabbitmq.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLLoggerMiddleware } from 'src/middlewares/graphql-logger.middleware';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionModule,
    ElasticsearchModule,
    RabbitMQModule,
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
