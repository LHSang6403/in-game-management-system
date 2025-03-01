import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ItemService } from './item.service';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { ItemEntity } from './entities/item.entity';

@Resolver(() => ItemEntity)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) {}

  @Query(() => [ItemEntity])
  async items() {
    return this.itemService.findAll();
  }

  @Query(() => ItemEntity, { nullable: true })
  async item(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.findOne(id);
  }

  @Mutation(() => ItemEntity)
  async createItem(@Args('data') data: CreateItemInput) {
    return this.itemService.create(data);
  }

  @Mutation(() => ItemEntity)
  async updateItem(@Args('data') data: UpdateItemInput) {
    return this.itemService.update(data);
  }

  @Mutation(() => ItemEntity)
  async removeItem(@Args('id', { type: () => Int }) id: number) {
    return this.itemService.remove(id);
  }
}
