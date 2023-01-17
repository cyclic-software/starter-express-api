import {request, response} from 'express';
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import generator from 'generate-password'
import Cryptr from 'cryptr';
import axios from 'axios';
const cryptr = new Cryptr('831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-')


class SignupCustomerController {
    async adress(request, response){
        try {
            const {adress} = request.body;

            //Working with circular json
            function axiosadress(){
                var config = {
                    method: 'get',
                    url: `https://api.geoapify.com/v1/geocode/autocomplete?text=${adress}&apiKey=c1e06482ec684266886b3806539e7e1c`,
                    headers: { }
                };
                const promise = axios(config);

                const dataPromise = promise.then((res)=>res.data);

                return dataPromise;
            }

            axiosadress()
            .then(data =>{
                return response.json({
                    mensagem:"Endereço encontrado",
                    resultado: data
                })
            })
            .catch((err)=>{
                return response.status(400).send({
                    error:"não foi possivel encontrar este endereço",
                    mensagem: err
                })
            })


        } 
        catch (error) {
            console.log(error);
            return response.status(500).send({
                error: "falhou em enviar mensagem",
                mensagem: error
            })

        }
    }
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
