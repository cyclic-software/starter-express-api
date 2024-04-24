import { prisma } from '../connection/prisma.js';

export const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, image, manufacturer } = req.body;
    const createProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image,
        manufacturer,
      },
    });

    return res.status(200).json(createProduct);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating product',
      message: error.message,
    });
  }
};
