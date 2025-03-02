import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { StitchingService } from '@modules/stitching/stitching.service';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLContext } from 'src/types/graphql-context.type';

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
    variables: object,
    @Context() context: GraphQLContext,
  ): Promise<unknown> {
    return this.stitchingService.executeGraphqlOperation(
      query,
      variables,
      context,
      'query',
    );
  }

  @Mutation(() => GraphQLJSON, { nullable: true })
  async executeMutation(
    @Args('mutation', { type: () => String }) mutation: string,
    @Args('variables', { type: () => GraphQLJSON, nullable: true })
    variables: object,
    @Context() context: GraphQLContext,
  ): Promise<unknown> {
    return this.stitchingService.executeGraphqlOperation(
      mutation,
      variables,
      context,
      'mutation',
    );
  }
}
