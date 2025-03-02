import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemTypeEntity } from 'src/modules/item-type/entities/item-type.entity';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class ItemEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  rarity: string;

  @Field(() => Int)
  power: number;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => ItemTypeEntity)
  itemType: ItemTypeEntity;

  @Field(() => GraphQLDateTime)
  createdAt: string;

  @Field(() => GraphQLDateTime)
  updatedAt: string;
}
