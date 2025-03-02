import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '@modules/user/user.service';
import { UserEntity } from '@modules/user/entities/user.entity';
import { UpdateUserInput } from '@modules/user/dto/update-user.input';
import { RegisterUserInput } from '@modules/user/dto/register-user.input';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserEntity])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => UserEntity, { nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id);
  }

  @Mutation(() => UserEntity)
  async register(@Args('data') data: RegisterUserInput) {
    return this.userService.register(data);
  }

  @Mutation(() => UserEntity)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.userService.update(id, data);
  }

  @Mutation(() => Boolean)
  async removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.remove(id);
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const result = await this.userService.login(email, password);
    return result.token;
  }
}
