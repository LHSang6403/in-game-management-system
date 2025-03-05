import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const org1 = await prisma.organization.create({
    data: {
      name: 'Organization A',
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Organization B',
      parentOrgId: org1.id,
    },
  });

  const hashedPassAdmin = await bcrypt.hash('admin123', 10);
  const hashedPassPlayer = await bcrypt.hash('player123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassAdmin,
      name: 'Admin User',
      role: 'ADMIN',
      organizationId: org1.id,
    },
  });

  await prisma.user.create({
    data: {
      email: 'player@example.com',
      password: hashedPassPlayer,
      name: 'Player User',
      role: 'PLAYER',
      organizationId: org2.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
