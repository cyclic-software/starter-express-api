import {request, response} from 'express';
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import SignupProject from '../database/schemas/SignupProjectSchema.js'
import jwt from 'jsonwebtoken';
import Cryptr from 'cryptr';
import { MailtrapClient } from 'mailtrap';
const cryptr = new Cryptr('831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-');
const secretkey = '831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-';

class loginController {

    async sendEmail(request, response){
        try {
            const {email} = request.body;

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
            let userId = userfind[0]._id.valueOf();


            //Create Link Confirmation
            //Add hours to date
            Date.prototype.addHours = function(h) {
                this.setTime(this.getTime() + (h*60*60*1000));
                return this;
            }
            //Format the data
            var currentdate = new Date().addHours(12);
            var options = { hour12: false };
            var current = currentdate.toLocaleString('pt-BR', options);

            //Encript
            let encrip = cryptr.encrypt(String(current)+"--"+userId);
            let linkencrip = "https://felipemduarte.com/entrar/trocarsenha/"+encrip;

            //Now send the email
            const TOKEN = "4269368e8b5d0b1e1f72da188d6b03be";
            const SENDER_EMAIL = "admin@felipemduarte.com";
            const RECIPIENT_EMAIL = email;

            const client = new MailtrapClient({ 'token': TOKEN });

            const sender = { name: "Não Responda", email: SENDER_EMAIL };

            client
            .send({
              category: "ALTERAR",
              custom_variables: {
                link: "",
              },
              from: sender,
              to: [{ email: RECIPIENT_EMAIL }],
              subject: "LINK DE ALTERAÇÃO",
              html: `
              <!doctype html>
              <html>
                <head>
                  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body style="font-family: sans-serif; background-color:white;">
                  <h1 style="text-align:center; font-size: 18px; font-weight: bold; margin-top: 8px">LINK DE ALTERAÇÃO</h1>
                  <h2 style="text-align:center; font-size: 14px; font-weight: bold; margin-top: 16px">Aqui está seu link para alterar senha</h2>
                  <a href="${linkencrip} style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;">ABRIR LINK DE ALTERAÇÃO</a>
                  <a href="" style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;"></a>
                  <p style="padding-top:32px">OU COPIE E COLE O LINK: ${linkencrip}</p>
                  <p class="bold" style="padding-top:32px">FELIPE M DUARTE - felipemduarte.com</p>
                </body>
                <style>
                 h1{
                    margin-top:32px !important;
                    font-size:24px !important;
                 }
                 a{
                    margin-left:18%;
                    color:white; 
                    background-color:black; 
                    padding:8px 16px; 
                    text-decoration: none;
                    display: inline-block;
                    cursor: pointer;
                    margin-top:16px;
                    font-weight: 700;
                 }
                 .bold{
                    font-weight:700;
                    text-align:center;
                 }
                </style>
              </html>
            `})
            .then(res=>{
                return response.status(200).send({
                    resultado: linkencrip,
                    email: res
                })
            })
            .catch(err=>{
                return response.status(400).send({
                    resultado: "Não foi possivel enviar um e-mail, tente novamente mais tarde!",
                    data: err
                })
            })
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
                        resultado: "Senha Incorreta"
                    })
                }

                //Password is default and need to be changed
                let userId = userfind[0]._id.valueOf();
                if(userfind[0].senhaisdefault === true){
                    //Create Link Confirmation
                    //Add hours to date
                    Date.prototype.addHours = function(h) {
                        this.setTime(this.getTime() + (h*60*60*1000));
                        return this;
                    }
                    //Format the data
                    var currentdate = new Date().addHours(12);
                    var options = { hour12: false };
                    var current = currentdate.toLocaleString('pt-BR', options);

                    //Encript
                    let encrip = cryptr.encrypt(String(current)+"--"+userId);
                    let linkencrip = "https://felipemduarte.com/entrar/trocarsenha/"+encrip;
                    return response.status(200).send({
                        resultado: "Por favor troque a senha padrão",
                        link: linkencrip
                    })
                }

                //You can login as admin
                if(userfind[0].admin === true){
                    const token = jwt.sign({
                        user_id:userId,
                    }, secretkey, {expiresIn:"1h"})
                    return response.status(200).send({
                        resultado: "Você foi autenticado com E-Mail",
                        nivel: "Administrador",
                        token: token,
                    })     
                }

                return response.status(200).send({
                    resultado: "Você foi autenticado com E-Mail",
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
