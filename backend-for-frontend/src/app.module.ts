import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { StitchingModule } from '@modules/stitching/stitching.module';
import { StitchingService } from '@modules/stitching/stitching.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from 'src/auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLLoggerMiddleware } from 'src/middlewares/graphql-logger.middleware';

@Module({
  imports: [
    HttpModule,
    StitchingModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [StitchingModule],
      useFactory: async (stitchingService: StitchingService) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          schema: stitchingService.mergedSchema || undefined,
          debug: true,
          autoSchemaFile: true,
          playground: false,
          plugins: [ApolloServerPluginLandingPageLocalDefault()],
        };
      },
      inject: [StitchingService],
    }),
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GraphQLLoggerMiddleware).forRoutes('/graphql');
  }
}
