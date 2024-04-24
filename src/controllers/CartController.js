import { prisma } from '../connection/prisma.js';

export const CreateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const createCart = await prisma.cart.create({
      data: {
        userId,
      },
    });

    return res.status(200).json(createCart);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating cart',
      message: error.message,
    });
  }
};

export const ReadCart = async (req, res) => {
  try {
    const { id } = req.params;
    const readCart = await prisma.cart.findMany({
      where: {
        id,
      },
    });

    return res.status(200).json(readCart);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating cart',
      message: error.message,
    });
  }
};

export const ReadCarts = async (req, res) => {
  try {
    const readCarts = await prisma.cart.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return res.status(200).json(readCarts);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating cart',
      message: error.message,
    });
  }
};

export const DeleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCart = await prisma.cart.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(deleteCart);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating cart',
      message: error.message,
    });
  }
};
