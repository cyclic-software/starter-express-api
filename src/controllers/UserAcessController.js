import { prisma } from '../connection/prisma.js';

export const CreateAccess = async (req, res) => {
    try{
        const { accessId, userId } = req.params;
        const createAcess = await prisma.userAccess.create({
          data: {
            accessId,
            userId
          }  
        })

        return res.status(200).json(createAcess);
    } catch(error){
        return res.status(400).json({
            error: 'Error creating acess',
            message: error.message,
        });
    };
    
};
