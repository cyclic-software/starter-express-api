import { prisma } from '../connection/prisma.js';

export const CreateUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    const emailCheck = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (emailCheck) {
      return res.status(403).json({ error: 'email is already in use' });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
        avatar,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error: 'Error creating user',
      message: error.message,
    });
  }
};

export const ReadUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        avatar: true,
        username: true,
        email: true,
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            cpf: true,
            birthDate: true,
            phone: true,
            isProfile: true,
            userId: true,
          },
        },
        Cart: {
          select: {
            id: true,
            userId: true,
            items: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing users',
      message: error.message,
    });
  }
};

export const ReadUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error: 'Error listing user',
      message: error.message,
    });
  }
};
export const UpdateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, avatar } = req.body;
    const isUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!isUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const emailCheck = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!emailCheck) {
      return res.status(403).json({ error: 'email not found' });
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
        email,
        password,
        avatar,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error: 'Error updating user',
      message: error.message,
    });
  }
};
export const DeleteUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const isUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!isUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = await prisma.user.delete({
      where: {
        id,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({
      error: 'Error deleting user',
      message: error.message,
    });
  }
};
