require('dotenv').config();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Roles password hashes
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const managerHash = await bcrypt.hash('Manager@123', 10);
  const headHash = await bcrypt.hash('Head@123', 10);
  const employeeHash = await bcrypt.hash('Employee@123', 10);

  // 1. Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetflow.com' },
    update: { passwordHash: adminHash, role: 'admin', name: 'System Admin' },
    create: { name: 'System Admin', email: 'admin@assetflow.com', passwordHash: adminHash, role: 'admin' },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@assetflow.com' },
    update: { passwordHash: managerHash, role: 'asset_manager', name: 'Asset Manager' },
    create: { name: 'Asset Manager', email: 'manager@assetflow.com', passwordHash: managerHash, role: 'asset_manager' },
  });

  const head = await prisma.user.upsert({
    where: { email: 'head@assetflow.com' },
    update: { passwordHash: headHash, role: 'department_head', name: 'Department Head' },
    create: { name: 'Department Head', email: 'head@assetflow.com', passwordHash: headHash, role: 'department_head' },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@assetflow.com' },
    update: { passwordHash: employeeHash, role: 'employee', name: 'Regular Employee' },
    create: { name: 'Regular Employee', email: 'employee@assetflow.com', passwordHash: employeeHash, role: 'employee' },
  });

  console.log('Users seeded successfully');

  // 2. Seed Departments
  const engDept = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering', status: 'active' },
  });

  const mktDept = await prisma.department.upsert({
    where: { name: 'Marketing' },
    update: {},
    create: { name: 'Marketing', status: 'active' },
  });

  console.log('Departments seeded successfully');

  // 3. Seed Asset Categories
  const category = await prisma.assetCategory.upsert({
    where: { name: 'IT Equipment' },
    update: {},
    create: { name: 'IT Equipment', description: 'Computers, conference rooms, laptops, etc.' }
  });

  console.log('Categories seeded successfully');

  // 4. Seed Assets
  const assets = [
    { id: 'asset-macbook', name: 'MacBook Pro 16', assetTag: 'AF-001', categoryId: category.id, status: 'allocated', location: 'HQ - Floor 3' },
    { id: 'asset-dell', name: 'Dell XPS 15', assetTag: 'AF-002', categoryId: category.id, status: 'allocated', location: 'HQ - Floor 2' },
    { id: 'asset-projector', name: 'Projector B1', assetTag: 'AF-003', categoryId: category.id, status: 'allocated', location: 'Conf Room B' },
    { id: 'asset-ev', name: 'EV Pool Car', assetTag: 'AF-004', categoryId: category.id, status: 'available', location: 'Garage' },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { id: asset.id },
      update: { name: asset.name, assetTag: asset.assetTag, categoryId: asset.categoryId, status: asset.status, location: asset.location },
      create: asset,
    });
  }

  console.log('Assets seeded successfully');

  // 5. Seed Allocations
  // Clean old active allocations for these seeded items to avoid duplicates
  await prisma.allocation.deleteMany({
    where: {
      assetId: { in: ['asset-macbook', 'asset-dell', 'asset-projector'] }
    }
  });

  // MacBook to Employee
  await prisma.allocation.create({
    data: {
      assetId: 'asset-macbook',
      employeeId: employee.id,
      status: 'active',
      allocatedDate: new Date('2026-06-01'),
      expectedReturnDate: new Date('2026-12-01'),
    }
  });

  // Dell to Department Head
  await prisma.allocation.create({
    data: {
      assetId: 'asset-dell',
      employeeId: head.id,
      status: 'active',
      allocatedDate: new Date('2026-05-15'),
      expectedReturnDate: new Date('2026-11-15'),
    }
  });

  // Projector to Engineering department
  await prisma.allocation.create({
    data: {
      assetId: 'asset-projector',
      departmentId: engDept.id,
      status: 'active',
      allocatedDate: new Date('2026-07-01'),
      expectedReturnDate: new Date('2026-08-01'),
    }
  });

  console.log('Allocations seeded successfully');

  // 6. Seed Notifications
  await prisma.notification.deleteMany({
    where: {
      userId: { in: [employee.id, head.id, manager.id, admin.id] }
    }
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: employee.id,
        type: 'asset_assigned',
        message: 'MacBook Pro 16 (AF-001) has been successfully assigned to you.',
        isRead: false,
        createdAt: new Date('2026-07-12T10:00:00Z'),
      },
      {
        userId: employee.id,
        type: 'maintenance_approved',
        message: 'Your maintenance request for MacBook Pro (AF-001) has been approved.',
        isRead: true,
        createdAt: new Date('2026-07-10T14:30:00Z'),
      },
      {
        userId: head.id,
        type: 'booking_confirmed',
        message: 'Your booking request for Conference Room B has been approved.',
        isRead: false,
        createdAt: new Date('2026-07-11T09:00:00Z'),
      }
    ]
  });

  console.log('Notifications seeded successfully');

  // 7. Seed Maintenance Requests
  await prisma.maintenanceRequest.deleteMany({
    where: {
      assetId: { in: ['asset-macbook', 'asset-dell', 'asset-projector'] }
    }
  });

  await prisma.maintenanceRequest.create({
    data: {
      assetId: 'asset-macbook',
      raisedBy: employee.id,
      issueDescription: 'Screen keeps flickering when connecting to external monitor.',
      status: 'pending',
      createdAt: new Date('2026-07-12T11:00:00Z'),
    }
  });

  console.log('Maintenance requests seeded successfully');
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });