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

    // Get latest asset
    const lastAsset = await prisma.asset.findFirst({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            assetTag: true,
        },
    });

    let nextNumber = 1;

    if (lastAsset) {
        const currentNumber = parseInt(
            lastAsset.assetTag.replace("AS", "")
        );

        nextNumber = currentNumber + 1;
    }

    const assetTag =
        "AS" +
        String(nextNumber).padStart(4, "0");

    return await prisma.asset.create({
        data: {
            ...data,
            assetTag,
        },
    });
}

// Get All Assets
async function getAssets(query) {
    const where = {};

    // Search by asset tag, name or location
    if (query.q) {
        where.OR = [
            {
                assetTag: {
                    contains: query.q,
                },
            },
            {
                name: {
                    contains: query.q,
                },
            },
            {
                location: {
                    contains: query.q,
                },
            },
        ];
    }

    // Filter by status
    if (query.status) {
        where.status = query.status;
    }

    // Filter by category
    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }

    return await prisma.asset.findMany({
        where,
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

async function updateAssetStatus(id, status) {

    return prisma.asset.update({
        where: {
            id,
        },
        data: {
            status,
        },
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
    updateAssetStatus,
};