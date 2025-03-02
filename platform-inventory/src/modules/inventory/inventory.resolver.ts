import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryEntity } from '@modules/inventory/entities/inventory.entity';
import { InventoryService } from '@modules/inventory/inventory.service';
import { CreateInventoryInput } from '@modules/inventory/dto/create-inventory.input';
import { UpdateInventoryInput } from '@modules/inventory/dto/update-inventory.input';
import { RemoveInventoryInput } from '@modules/inventory/dto/remove-inventory.input';

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
  async updateInventory(@Args('data') data: UpdateInventoryInput) {
    return this.inventoryService.updateQuantity(
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
