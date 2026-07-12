require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category.routes');
const assetRoutes = require("./routes/asset.routes");
const dashboardRoutes = require('./routes/dashboard.routes');
const bookingRoutes = require('./routes/booking.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const auditRoutes = require('./routes/audit.routes');
const auditItemRoutes = require('./routes/audit-items.routes');
const reportsRoutes = require('./routes/reports.routes');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/bookings', bookingRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/audit-cycles', auditRoutes);
app.use('/audit-items', auditItemRoutes);
app.use('/reports', reportsRoutes);

app.use("/assets", assetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));