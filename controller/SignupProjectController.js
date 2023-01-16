import {request, response} from 'express';
import SignupProject from '../database/schemas/SignupProjectSchema.js'

class SignupProjectController {
    async find(request, response){
        try {
            var id = request.params.id;
            const contratos = await SignupProject.findById(id);
            return response.json(contratos);
        }
        catch (error) { 
            console.log(error);
            return response.status(500).send({
                error: "Alguma coisa deu errado, tente novamente",
                mensagem: error
            })
        }

    }
    async create(request, response){
        try {
            const {projname, domain, customer, discount, price, startdate, linkonline, estimatedtime, functionalities, productservice, plataformmodule, objectives, criadoEm} = request.body;

            let col1pass = generator.generate({
                length:4,
                numbers: true,
            })

            let col2pass = generator.generate({
                length:3,
                numbers: true,
            })

            let col3pass = generator.generate({
                length:2,
                numbers: true,
            })
            
            function catchletters(projname){
                var names = projname.split(' ');
                var initials = names[0].substring(0,1).toUpperCase();

                if(names.length > 1) {
                    initials += names[names.length - 1].substring(0,1).toUpperCase();
                }

                return initials
            }

            let projectid = col1pass + "-" + col2pass + '-' + col3pass + catchletters(projname);
            //Project Id generator Closed


            const signupprojectcontroller = await SignupProject.create({
                projname,
                projectid,
                linkonline,
                domain, 
                customer, 
                discount, 
                price,
                startdate, 
                estimatedtime, 
                functionalities, 
                productservice, 
                plataformmodule, 
                objectives, 
                criadoEm
            });

            return response.json(signupprojectcontroller);
        }
        catch (error) {
            console.log(error);
            return response.status(500).send({
                error: "falhou em enviar mensagem",
                mensagem: error
            })

        }
    }

}

export default new SignupProjectController
