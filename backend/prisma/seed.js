require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@assetflow.com';
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: 'admin', name: 'System Admin' },
    create: {
      name: 'System Admin',
      email,
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin upserted:', admin.email, '| role:', admin.role);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });