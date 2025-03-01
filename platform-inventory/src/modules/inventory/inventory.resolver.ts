import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryService } from './inventory.service';
import { Int } from '@nestjs/graphql';

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
  async createInventory(
    @Args('userId') userId: number,
    @Args('itemId', { type: () => Int }) itemId: number,
    @Args('quantity', { type: () => Int }) quantity: number,
    @Args('json', { nullable: true }) json?: string,
  ) {
    return this.inventoryService.create(userId, itemId, quantity, json);
  }

  @Mutation(() => InventoryEntity)
  async updateInventory(
    @Args('id') id: number,
    @Args('change', { type: () => Int }) change: number,
  ) {
    return this.inventoryService.updateQuantity(id, change);
  }

  @Mutation(() => InventoryEntity)
  async removeInventory(@Args('id') id: number) {
    return this.inventoryService.remove(id);
  }
}
