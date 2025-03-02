import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateInventoryInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  change: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  reason: string;
}
