import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class TransactionEntity {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  itemId?: number;

  @Field(() => Int, { nullable: true })
  oldQty?: number;

  @Field(() => Int, { nullable: true })
  newQty?: number;

  @Field(() => String, { nullable: true })
  reason?: string;

  @Field(() => String, { nullable: true })
  timestamp?: string;
}
