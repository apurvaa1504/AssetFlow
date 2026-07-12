const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function getAllUsers() {
    return await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
}

async function updateUserRole(id, newRole) {
    return await prisma.user.update({
        where: { id },
        data: { role: newRole },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
}

module.exports = {
    getAllUsers,
    updateUserRole,
};