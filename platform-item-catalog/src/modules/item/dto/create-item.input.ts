import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateItemInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  rarity: string;

  @Field(() => Int)
  power: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Int)
  itemTypeId: number;
}
