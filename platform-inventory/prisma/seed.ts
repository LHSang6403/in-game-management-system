import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding inventory data...');

  const inventoryData = [
    {
      userId: 1,
      itemId: 101,
      quantity: 10,
      json: JSON.stringify({ rarity: 'common', durability: 100 }),
    },
    {
      userId: 2,
      itemId: 102,
      quantity: 5,
      json: JSON.stringify({ rarity: 'rare', durability: 50 }),
    },
    {
      userId: 3,
      itemId: 103,
      quantity: 20,
      json: JSON.stringify({ rarity: 'epic', durability: 200 }),
    },
    {
      userId: 4,
      itemId: 104,
      quantity: 0, // Item đã hết
      json: JSON.stringify({ rarity: 'legendary', durability: 0 }),
    },
  ];

  for (const data of inventoryData) {
    await prisma.inventory.create({ data });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
