const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

// Create Asset
async function createAsset(data) {
    return await prisma.asset.create({
        data,
    });
}

// Get All Assets
async function getAssets() {
    return await prisma.asset.findMany({
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

// Get Asset By ID
async function getAssetById(id) {
    return await prisma.asset.findUnique({
        where: {
            id,
        },
        include: {
            category: true,
        },
    });
}

// Update Asset
async function updateAsset(id, data) {
    return await prisma.asset.update({
        where: {
            id,
        },
        data,
    });
}

// Delete Asset
async function deleteAsset(id) {
    return await prisma.asset.delete({
        where: {
            id,
        },
    });
}

module.exports = {
    createAsset,
    getAssets,
    getAssetById,
    updateAsset,
    deleteAsset,
};