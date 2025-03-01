import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  parentOrgId?: number;
}
