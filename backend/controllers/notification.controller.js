const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// GET /notifications
async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const result = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      read: n.isRead,
      date: n.createdAt ? n.createdAt.toISOString().slice(0, 10) : null,
    }));

    res.json(result);
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ error: err.message });
  }
}

// PATCH /notifications/:id/read
async function markAsRead(req, res) {
  try {
    const updated = await prisma.notification.updateMany({
      where: {
        id: req.params.id,
        userId: req.user.userId,
      },
      data: {
        isRead: true,
      },
    });

    res.json({ success: true, count: updated.count });
  } catch (err) {
    console.error('markAsRead error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getNotifications,
  markAsRead,
};
