/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `ItemType` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "extra" JSONB;

-- AlterTable
ALTER TABLE "ItemType" ADD COLUMN     "extra" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "unique_item_name" ON "Item"("name");

-- CreateIndex
CREATE INDEX "Item_power_idx" ON "Item"("power");

-- CreateIndex
CREATE INDEX "Item_createdAt_idx" ON "Item"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "unique_item_type_name" ON "ItemType"("name");

-- CreateIndex
CREATE INDEX "ItemType_createdAt_idx" ON "ItemType"("createdAt");
