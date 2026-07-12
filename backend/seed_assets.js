require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Connecting to database...');

  // Create default category
  const category = await prisma.assetCategory.upsert({
    where: { name: 'IT Equipment' },
    update: {},
    create: { name: 'IT Equipment', description: 'Computers, conference rooms, etc.' }
  });

  console.log('Category registered: ' + category.name);

  // Register the test assets matching the frontend fallback options
  const assetsToCreate = [
    { id: 'a-room-b2', name: 'Room B2', assetTag: 'AF-ROOM-B2', categoryId: category.id, status: 'available' },
    { id: 'a-projector-1', name: 'Projector 1', assetTag: 'AF-0087', categoryId: category.id, status: 'available' },
    { id: 'a-ev-car', name: 'EV Pool Car', assetTag: 'AF-0142', categoryId: category.id, status: 'available' }
  ];

  for (const asset of assetsToCreate) {
    const created = await prisma.asset.upsert({
      where: { id: asset.id },
      update: {},
      create: asset
    });
    console.log(`Asset registered: ${created.name} (${created.assetTag})`);
  }

  await prisma.$disconnect();
  console.log('Seeding finished successfully.');
}

main().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
