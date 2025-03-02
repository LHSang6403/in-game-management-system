import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class RegisterUserInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { defaultValue: 'Default Name' })
  name?: string;

  @Field(() => Role, { defaultValue: Role.PLAYER })
  role?: Role;

  @Field(() => Int, { nullable: true })
  organizationId?: number;
}
