import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateInventoryInput {
  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  itemId: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  json?: string;
}
