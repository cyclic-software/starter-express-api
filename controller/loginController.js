import {request, response} from 'express';
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import SignupProject from '../database/schemas/SignupProjectSchema.js'
import generator from 'generate-password'
import jwt from 'jsonwebtoken';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-');
const secretkey = '831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-';

class loginController {

    async sendEmail(request, response){
        try {
            const {email, projectid} = request.body;
            console.log(request.usuario);

            if(!email){
                return response.status(400).send({
                    resultado: "Por favor, insira um email"
                })
            }

            const userfind = await SignupCustomer.find({"email":email})
            .catch(err=>{
                console.log(err);
            });
                
            //Email not exist
            if(userfind[0] === undefined){
                return response.status(400).send({
                    resultado: "Este e-mail não existe cadastrado"
                })
            }

            //Update password
            var passGen = generator.generate({
                length:10,
                numbers: true,
                lowercase: true,
                uppercase: true,
            })
            let generatePassword = cryptr.encrypt(passGen)
            await SignupCustomer.findOneAndUpdate({"email":email}, {$set:{senha: generatePassword}},{new: true},(err, doc) =>{
                if(err){
                    console.log(err);
                } else {
                    return response.status(200).send({
                        resultado: "senha alterada com sucesso",
                        doc
                    })
                }
            })

            //Now send the email
            //Pass generatePassword to the email
            //To be able to use post with the actual password to change to his password

        }
        catch (error) {
            return response.status(500).send({
                error: "falhou em captar a mensagem",
                mensagem: error
            })

        }
    }
    async find(request, response){
        try {

            const {email,password,projectid} = request.body;


            //Not was sent
            if(!email && !projectid){
                return response.status(400).send({
                    resultado: "Por favor, insira um email ou um ProjetoID"
                })
            }
            
            //Login with email
            if (projectid === "" || projectid === undefined){
                const userfind = await SignupCustomer.find({"email":email})
                .catch(err=>{
                    console.log(err);
                });
                
                //Email not exist
                if(userfind[0] === undefined){
                    return response.status(400).send({
                        resultado: "Este e-mail não existe cadastrado"
                    })
                }
                
                
                //Wrong Password
                var decriptPass = cryptr.decrypt(userfind[0].senha);
                if(decriptPass !== password) {
                    return response.status(400).send({
                        resultado: "são diferentes"
                    })
                }

                //Password is default and need to be changed
                if(userfind[0].senhaisdefault === true){
                    return response.status(200).send({
                        resultado: "Por favor troque a senha"
                    })
                }

                //You can login as admin
                let userId = userfind[0]._id.valueOf();
                let procEmail = cryptr.encrypt(email);
                let procId = cryptr.encrypt(userId);
                const session = procEmail + "---" + procId;
                if(userfind[0].admin === true){
                    const token = jwt.sign({
                        user_id:userId,
                        email: email
                    }, secretkey, {expiresIn:"1h"})
                    return response.status(200).send({
                        resultado: "Você foi autenticado com E-Mail",
                        nivel: "Administrador",
                        token: token,
                        session: session
                    })     
                }
                return response.status(200).send({
                    resultado: "Você foi autenticado com E-Mail",
                    session: session
                })
            }

            //If login is with ProjetoID
            if(email === undefined || email === ""){
                const projectfind = await SignupProject.find({"projectid":projectid}).catch(err=>{
                    console.log(err);
                });

                if(projectfind[0] === undefined){
                    return response.status(400).send({
                        resultado: "Este ID Projeto talvez tenha sido alterado ou não exista"
                    })
                }

                //You can login
                return response.status(200).send({
                    resultado: "Você entrou com ProjetoID"
                })           
            }

        }
        catch (error) {
            return response.status(500).send({
                error: "falhou em captar a mensagem",
                mensagem: error
            })

        }
    }
    async create(request, response){
        try {
            const {email,senhaatual,senhaconfirmacao,senha} = request.body;

            const userfind = await SignupCustomer.find({"email":email})
            .catch(err=>{
                console.log(err);
            });

            //Email not exist
            if(userfind[0] === undefined){
                return response.status(400).send({
                    resultado: "Este e-mail não existe cadastrado"
                })
            }

            //Wrong Password
            let userpassword = userfind[0].senha;
            var decriptPass = cryptr.decrypt(userpassword);
            console.log(decriptPass);
            if(decriptPass !== senhaatual) {
                return response.status(400).send({
                    resultado: "Não coincide com a senha atual"
                })
            }
            
            //Password Confirmation is right
            if(senha !== senhaconfirmacao){
                return response.status(400).send({
                    resultado: "Senhas de confirmação estão incorretas"
                })
            }

            //Password can be like the last
            if(senha === senhaatual){
                return response.status(400).send({
                    resultado: "Senha não pode ser igual antiga"
                })
            }

            let newPassword = cryptr.encrypt(senha);

            await SignupCustomer.findOneAndUpdate({"email":email}, {$set:{senhaisdefault: false}},{new: true})
            .clone()
            .catch(err=>{
                console.log(err);
            });

            await SignupCustomer.findOneAndUpdate({"email":email}, {$set:{senha: newPassword}},{new: true},(err, doc) =>{
                if(err){
                    console.log(err);
                } else {
                    return response.status(200).send({
                        resultado: "senha alterada com sucesso",
                        doc
                    })
                }
            })
            .clone();

        }

        catch (error) {
            return response.status(500).send({
                error: "falhou em captar a mensagem",
                mensagem: error
            })
        }
    }
}


export default new loginController
