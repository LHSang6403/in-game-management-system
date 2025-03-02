import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const weaponType = await prisma.itemType.create({
    data: { name: 'Weapon' },
  });
  const potionType = await prisma.itemType.create({
    data: { name: 'Potion' },
  });

  await prisma.item.create({
    data: {
      name: 'Sword of Fire',
      rarity: 'Rare',
      power: 50,
      imageUrl:
        'https://cdn11.bigcommerce.com/s-fy9rv139a5/images/stencil/original/h/884016_b__46833.original.jpg',
      itemTypeId: weaponType.id,
    },
  });

  await prisma.item.create({
    data: {
      name: 'Health Potion',
      rarity: 'Common',
      power: 10,
      itemTypeId: potionType.id,
      imageUrl:
        'https://i.pinimg.com/736x/40/66/42/406642e3e42f5a6227d362b0d867b1b6.jpg',
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
