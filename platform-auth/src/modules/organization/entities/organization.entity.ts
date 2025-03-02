import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GraphQLDateTime } from 'graphql-scalars';

@ObjectType()
export class OrganizationEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => [OrganizationEntity], { nullable: true })
  children?: OrganizationEntity[];

  @Field(() => OrganizationEntity, { nullable: true })
  parentOrg?: OrganizationEntity;

  @Field(() => GraphQLDateTime)
  createdAt: string;

  @Field(() => GraphQLDateTime)
  updatedAt: string;
}
