import { Field, InputType, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@InputType()
export class RegisterUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ defaultValue: 'Default Name' })
  name?: string;

  @Field(() => Role, { defaultValue: Role.PLAYER })
  role?: Role;

  @Field(() => Int, { nullable: true })
  organizationId?: number;
}
