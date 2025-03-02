import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateItemTypeInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}
