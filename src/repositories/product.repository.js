const { prisma } = require("../services/prisma");

exports.createProduct = async (data) => {
    const product = await prisma.product.create({
        data,
    });

    return product;
};

exports.getProduct = async () => {
    await prisma.$connect();
    const product = await prisma.product.findMany({});

    return product;
};

exports.getProductId = async (id) => {
    const product = await prisma.product.findUnique({ where: { id } });

    return product;
};

exports.updateId = async (id, data) => {
    const product = await prisma.product.update({ data, where: { id } });

    return product;
};

exports.deleteId = async (id) => {
    const product = await prisma.product.delete({ where: { id } });

    return product;
};
