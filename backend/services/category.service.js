const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function createCategory(data) {
    return await prisma.assetCategory.create({
        data,
    });
}

async function getAllCategories() {
    return await prisma.assetCategory.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

module.exports = {
    createCategory,
    getAllCategories,
};