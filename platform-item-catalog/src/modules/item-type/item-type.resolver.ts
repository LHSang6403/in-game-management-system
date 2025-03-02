import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemTypeService } from '@modules/item-type/item-type.service';
import { CreateItemTypeInput } from '@modules/item-type/dto/create-item-type.input';
import { UpdateItemTypeInput } from '@modules/item-type/dto/update-item-type.input';
import { ItemTypeEntity } from '@modules/item-type/entities/item-type.entity';

@Resolver(() => ItemTypeEntity)
export class ItemTypeResolver {
  constructor(private readonly itemTypeService: ItemTypeService) {}

  @Query(() => [ItemTypeEntity])
  async itemTypes() {
    return this.itemTypeService.findAll();
  }

  @Query(() => ItemTypeEntity, { nullable: true })
  async itemType(@Args('id', { type: () => Int }) id: number) {
    return this.itemTypeService.findOne(id);
  }

  @Mutation(() => ItemTypeEntity)
  async createItemType(@Args('data') data: CreateItemTypeInput) {
    return this.itemTypeService.create(data);
  }

  @Mutation(() => ItemTypeEntity)
  async updateItemType(@Args('data') data: UpdateItemTypeInput) {
    return this.itemTypeService.update(data);
  }

  @Mutation(() => ItemTypeEntity)
  async removeItemType(@Args('id', { type: () => Int }) id: number) {
    return this.itemTypeService.remove(id);
  }
}
