import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryEntity } from '@modules/inventory/entities/inventory.entity';
import { InventoryService } from '@modules/inventory/inventory.service';
import { CreateInventoryInput } from '@modules/inventory/dto/create-inventory.input';
import { UpdateInventoryInput } from '@modules/inventory/dto/update-inventory.input';
import { RemoveInventoryInput } from '@modules/inventory/dto/remove-inventory.input';
import { extractUserInfo } from 'src/utils/user.utils';
import { GraphQLContext } from 'src/types/graphql-context.type';

@Resolver(() => InventoryEntity)
export class InventoryResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  @Query(() => [InventoryEntity])
  async inventoryList() {
    return this.inventoryService.findAll();
  }

  @Query(() => InventoryEntity, { nullable: true })
  async inventory(@Args('id') id: number) {
    return this.inventoryService.findOne(id);
  }

  @Mutation(() => InventoryEntity)
  async createInventory(@Args('data') data: CreateInventoryInput) {
    return this.inventoryService.create(
      data.userId,
      data.itemId,
      data.quantity,
      data.json,
    );
  }

  @Mutation(() => InventoryEntity)
  async updateInventory(
    @Args('data') data: UpdateInventoryInput,
    @Context() context: GraphQLContext,
  ) {
    const { id, role } = extractUserInfo(context);
    await this.inventoryService.canUpdateInventory(id, role, data.id);

    return this.inventoryService.updateQuantityTransaction(
      data.id,
      data.change,
      data.userId,
      data.reason,
    );
  }

  @Mutation(() => InventoryEntity)
  async removeInventory(@Args('data') data: RemoveInventoryInput) {
    return this.inventoryService.remove(data.id, data.userId, data.reason);
  }
}
