import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role } from '@prisma/client';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
export class UserEntity {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  email: string;

  @Field(() => String)
  name: string;

  @Field(() => Role)
  role: Role;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;
}
