import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemTypeInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
