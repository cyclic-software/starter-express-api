import { prisma } from '../connection/prisma.js';

export const CreateCartItem = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const createCarItem = await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity,
      },
    });

    return res.status(200).json(createCarItem);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating items',
      message: error.message,
    });
  }
};

export const ReadCartItems = async (req, res) => {
  try {
    const readCarItems = await prisma.cartItem.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return res.status(200).json(readCarItems);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing item',
      message: error.message,
    });
  }
};

export const ReadCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const readCarItem = await prisma.cartItem.findUnique({
      where: {
        id,
      },
    });

    if (!readCarItem) {
      return res.status(400).json({
        error: 'Cart item not found',
      });
    }

    return res.status(200).json(readCarItem);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing item',
      message: error.message,
    });
  }
};

export const UpdateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateCarItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        cartId,
        productId,
        quantity,
      },
    });

    return res.status(200).json(updateCarItem);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing item',
      message: error.message,
    });
  }
};
export const DeleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCarItems = await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    return res.status(200).json(deleteCarItems);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing item',
      message: error.message,
    });
  }
};
