import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ItemEntity } from 'src/modules/item/entities/item.entity';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class ItemTypeEntity {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => [ItemEntity], { nullable: true })
  items?: ItemEntity[];

  @Field(() => GraphQLDateTime)
  createdAt: string;

  @Field(() => GraphQLDateTime)
  updatedAt: string;
}
