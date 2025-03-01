import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemEntity } from 'src/modules/item/entities/item.entity';

@ObjectType()
export class ItemTypeEntity {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [ItemEntity], { nullable: true })
  items?: ItemEntity[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
