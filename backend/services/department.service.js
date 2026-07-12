const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
    adapter,
});

async function createDepartment(data) {
    return await prisma.department.create({
        data,
    });
}

async function getAllDepartments() {
    return await prisma.department.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
}

async function updateDepartment(id, data) {
    return await prisma.department.update({
        where: { id },
        data,
    });
}

module.exports = {
    createDepartment,
    getAllDepartments,
    updateDepartment,
};