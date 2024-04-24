import { prisma } from '../connection/prisma.js';

export const CreateAccess = async (req, res) => {
    try{
        const { name } = req.body;
        const createAcess = await prisma.access.create({
        data: {
            name,
        },
    });

    return res.status(200).json(createAcess);
    } catch(error){
        return res.status(400).json({
            error: 'Error creating access',
            message: error.message,
        });
    };
    
};
