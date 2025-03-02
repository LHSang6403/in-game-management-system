-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ItemType" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
