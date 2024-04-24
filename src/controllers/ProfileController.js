import { prisma } from '../connection/prisma.js';

export const CreateProfile = async (req, res) => {
  try {
    const { firstName, lastName, cpf, birthDate, phone, userId } = req.body;

    const isCpf = await prisma.profile.findUnique({
      where: {
        cpf,
      },
    });

    if (isCpf) {
      return res.status(403).json({ message: 'CPF is already in use' });
    }

    const isUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isUser) {
      return res.status(403).json({ message: 'UserId already exists' });
    }

    const profile = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        cpf,
        birthDate,
        phone,
        userId,
        isProfile: true,
      },
    });
    return res.status(201).json(profile);
  } catch (error) {
    return res.status(400).json({ error: `Error creating profile: ${error}` });
  }
};

export const GetProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const isProfile = await prisma.profile.findUnique({
      where: {
        id: id,
      },
    });

    if (!isProfile) {
      return res.status(404).json({ message: 'Not-existent Profile' });
    }

    return res.status(200).json(isProfile);
  } catch (error) {
    return res.error(400).json({ error: `Profile not found: ${error}` });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, cpf, birthDate, phone } = req.body;
    const isProfile = await prisma.profile.findUnique({
      where: {
        id: id,
      },
    });

    if (!isProfile) {
      return res.status(404).json({ message: 'Not-existent Profile' });
    }

    const profile = await prisma.profile.update({
      data: {
        firstName,
        lastName,
        cpf,
        birthDate,
        phone,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(400).json({ error: `Unable to update: ${error}` });
  }
};

export const DeleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const isProfile = await prisma.profile.findUnique({
      where: {
        id: id,
      },
    });

    if (!isProfile) {
      return res.status(404).json({ message: 'Not-existent Profile' });
    }

    await prisma.profile.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: 'Profile successfully deleted' });
  } catch (error) {
    return res.status(400).json({ error: `Id not found, Profile not deleted: ${error}` });
  }
};
