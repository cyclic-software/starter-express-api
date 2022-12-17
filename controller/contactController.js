import {request, response} from 'express';
import LeadContact from '../database/schemas/contactSchema.js'

class ContactController {
    async create(request, response){
        try {
            const {nome, profissao, procura, cellphone, criadoEm, referee} = request.body;

            const leadcontact = await LeadContact.create({
                nome,
                profissao,
                procura,
                cellphone,
                referee,
                criadoEm
            });

            return response.json(leadcontact);
        }
        catch (error) {
            return response.status(500).send({
                error: "falhou em enviar mensagem",
                mensagem: error
            })

        }
    }

}

export default new ContactController
