import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateItemTypeInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;
}
