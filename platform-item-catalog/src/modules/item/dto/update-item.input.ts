import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  rarity?: string;

  @Field(() => Int, { nullable: true })
  power?: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Int, { nullable: true })
  itemTypeId?: number;
}
