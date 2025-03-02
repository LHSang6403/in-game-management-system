import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateItemTypeInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
