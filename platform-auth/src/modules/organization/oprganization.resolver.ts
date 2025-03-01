import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrganizationService } from '@modules/organization/organization.service';
import { CreateOrganizationInput } from '@modules/organization/dto/create-organization.input';
import { UpdateOrganizationInput } from '@modules/organization/dto/update-organization.input';
import { OrganizationEntity } from '@modules/organization/entities/organization.entity';

@Resolver(() => OrganizationEntity)
export class OrganizationResolver {
  constructor(private orgService: OrganizationService) {}

  @Query(() => [OrganizationEntity])
  async organizations() {
    return this.orgService.findAll();
  }

  @Query(() => OrganizationEntity, { nullable: true })
  async organization(@Args('id', { type: () => Int }) id: number) {
    return this.orgService.findOne(id);
  }

  @Mutation(() => OrganizationEntity)
  async createOrganization(@Args('data') data: CreateOrganizationInput) {
    return this.orgService.create(data);
  }

  @Mutation(() => OrganizationEntity)
  async updateOrganization(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateOrganizationInput,
  ) {
    return this.orgService.update(id, data);
  }

  @Mutation(() => Boolean)
  async removeOrganization(@Args('id', { type: () => Int }) id: number) {
    return this.orgService.remove(id);
  }
}
