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
async function getCategoryById(id) {
    return await prisma.assetCategory.findUnique({
        where: {
            id,
        },
    });
}

async function updateCategory(id, data) {
    return await prisma.assetCategory.update({
        where: {
            id,
        },
        data,
    });
}

async function deleteCategory(id) {
    return await prisma.assetCategory.delete({
        where: {
            id,
        },
    });
}
module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};