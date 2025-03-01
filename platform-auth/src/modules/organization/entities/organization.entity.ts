import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrganizationEntity {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => [OrganizationEntity], { nullable: true })
  children?: OrganizationEntity[];

  @Field(() => OrganizationEntity, { nullable: true })
  parentOrg?: OrganizationEntity;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
