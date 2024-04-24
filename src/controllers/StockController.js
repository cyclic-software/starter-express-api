import { prisma } from '../connection/prisma.js';

export const CreateStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const createStock = await prisma.stock.create({
      data: {
        productId,
        quantity,
      },
    });

    return res.status(200).json(createStock);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating stock',
      message: error.message,
    });
  }
};
