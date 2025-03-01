import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { GraphQLSchema, graphql } from 'graphql';
import { Inject } from '@nestjs/common';
import { StitchingService } from './stitching.service';
import GraphQLJSON from 'graphql-type-json';

@Resolver()
export class StitchingResolver {
  constructor(
    @Inject(StitchingService)
    private readonly stitchingService: StitchingService,
  ) {}

  @Query(() => String)
  async healthCheck(): Promise<string> {
    return 'BFF Service is up and running!';
  }

  @Query(() => GraphQLJSON, { nullable: true })
  async executeQuery(
    @Args('query', { type: () => String }) query: string,
    @Args('variables', { type: () => GraphQLJSON, nullable: true })
    variables: any,
    @Context() context: any,
  ): Promise<any> {
    if (!this.stitchingService.mergedSchema) {
      throw new Error('Merged schema is not available');
    }

    try {
      const result = await graphql({
        schema: this.stitchingService.mergedSchema as GraphQLSchema,
        source: query,
        variableValues: variables || {},
        contextValue: context,
      });

      if (result.errors) {
        throw new Error(
          `GraphQL Errors: ${result.errors.map((e) => e.message).join(', ')}`,
        );
      }

      return result.data;
    } catch (error) {
      throw new Error(`Error executing query: ${error.message}`);
    }
  }

  @Mutation(() => GraphQLJSON, { nullable: true })
  async executeMutation(
    @Args('mutation', { type: () => String }) mutation: string,
    @Args('variables', { type: () => GraphQLJSON, nullable: true })
    variables: any,
    @Context() context: any,
  ): Promise<any> {
    if (!this.stitchingService.mergedSchema) {
      throw new Error('Merged schema is not available');
    }

    try {
      const result = await graphql({
        schema: this.stitchingService.mergedSchema as GraphQLSchema,
        source: mutation,
        variableValues: variables || {},
        contextValue: context,
      });

      if (result.errors) {
        throw new Error(
          `GraphQL Errors: ${result.errors.map((e) => e.message).join(', ')}`,
        );
      }

      return result.data;
    } catch (error) {
      throw new Error(`Error executing mutation: ${error.message}`);
    }
  }
}
