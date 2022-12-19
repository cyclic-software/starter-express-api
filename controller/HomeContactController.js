import {request, response} from 'express';
import HomeContact from '../database/schemas/homeContactSchema.js'

class HomeContactController {
    async create(request, response){
        try {
            const {nome, sobrenome, email, mensagem} = request.body;

            const homecontact = await HomeContact.create({
                nome,
                sobrenome,
                email,
                mensagem
            });

            return response.json(homecontact);
        }
        catch (error) {
            return response.status(500).send({
                error: "falhou em enviar mensagem",
                mensagem: error
            })

        }
    }

}

export default new HomeContactController
