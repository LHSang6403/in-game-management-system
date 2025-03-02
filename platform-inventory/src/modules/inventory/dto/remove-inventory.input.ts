import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class RemoveInventoryInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  reason: string;
}
