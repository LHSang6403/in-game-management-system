import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemTypeEntity } from 'src/modules/item-type/entities/item-type.entity';

@ObjectType()
export class ItemEntity {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  rarity: string;

  @Field(() => Int)
  power: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => ItemTypeEntity)
  itemType: ItemTypeEntity;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
