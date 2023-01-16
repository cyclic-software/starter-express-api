import {request, response} from 'express';
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import generator from 'generate-password'
import Cryptr from 'cryptr';
const cryptr = new Cryptr('831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-')


class SignupCustomerController {
    async create(request, response){
        try {
            const {nome, email, celular, encontradopor, instagram, referenciadopor, admin, criadoEm} = request.body;

            var Senha = generator.generate({
                length:10,
                numbers: true,
                lowercase: true,
                uppercase: true,
            })

            const senha = cryptr.encrypt(Senha)

            const signupcustomercontroller = await SignupCustomer.create({
                nome,
                email,
                senha,
                celular,
                encontradopor,
                instagram,
                referenciadopor,
                admin,
                criadoEm,
            });

            return response.json(signupcustomercontroller);
        }
        catch (error) {
            return response.status(500).send({
                error: "falhou em enviar mensagem",
                mensagem: error
            })

        }
    }

}

export default new SignupCustomerController
