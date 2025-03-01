import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionEntity {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  itemId?: number;

  @Field(() => Int, { nullable: true })
  oldQty?: number;

  @Field(() => Int, { nullable: true })
  newQty?: number;

  @Field({ nullable: true })
  reason?: string;

  @Field({ nullable: true })
  timestamp?: string;
}
