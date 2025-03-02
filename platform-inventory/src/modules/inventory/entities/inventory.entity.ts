import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class InventoryEntity {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  itemId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => GraphQLJSON, { nullable: true })
  json?: typeof GraphQLJSON;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
