import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateOrganizationInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  parentOrgId?: number;
}
