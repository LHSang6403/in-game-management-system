import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  rarity?: string;

  @Field(() => Int, { nullable: true })
  power?: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => Int, { nullable: true })
  itemTypeId?: number;
}
