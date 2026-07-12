require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@assetflow.com';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Admin already exists:', email);
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email,
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin created:', admin.email);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });