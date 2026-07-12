const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});
async function createAllocation(data) {

    const asset = await prisma.asset.findUnique({
        where: {
            id: data.assetId,
        },
    });

    if (!asset) {
        throw new Error("Asset not found");
    }

    if (asset.status !== "available") {
        throw new Error("Asset already allocated");
    }

    const allocation = await prisma.allocation.create({
        data,
    });

    await prisma.asset.update({
        where: {
            id: data.assetId,
        },
        data: {
            status: "allocated",
        },
    });

    return allocation;
}
async function returnAsset(id) {

    const allocation = await prisma.allocation.update({
        where: {
            id,
        },
        data: {
            actualReturnDate: new Date(),
            status: "returned",
        },
    });

    await prisma.asset.update({
        where: {
            id: allocation.assetId,
        },
        data: {
            status: "available",
        },
    });

    return allocation;
}
module.exports = {
    createAllocation,
    returnAsset,
};