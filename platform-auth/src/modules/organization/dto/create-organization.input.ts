import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationInput {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  parentOrgId?: number;
}
