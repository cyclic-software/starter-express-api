import {request, response} from 'express';
import PaymentCreate from '../database/schemas/PaymentSchema.js'
import SignupProject from '../database/schemas/SignupProjectSchema.js'

import axios from 'axios';


class CreatePaymentLink {
    async check(request, response){
        try {
            const {id} = request.body;
            const projectfind = await SignupProject.findById(id);

            if(projectfind === undefined){
                return response.status(400).send({
                    error: "Não foi encontrado um projeto.",
                })
            }

            let ispaid = projectfind.paid;
            if(ispaid === false){
                return response.status(400).send({
                    error: "Este projeto, não houve pagamento",
                })
            } 

            const paymentfind = await PaymentCreate.find({"reference_id":id});
            if(paymentfind[0] === undefined){
                return response.status(500).send({
                    error: "Nenhum pagamento foi criado.",
                })
            } 

            let status = paymentfind[0].statuspayment;
            let paymentid = paymentfind[0].paymentid;
        
            return response.json({
                mensagem:"Requisição feita com sucesso", 
                statuspagamento: status,
                pagamentoid: paymentid
            })
        }
        catch (error) {
            console.log(error);
            return response.status(500).send({
                error: "falhou em cadastrar conta",
                mensagem: error
            })

        }
    }
    async create(request, response){
        try {
            const {customername, customeremail, rg, cpf, adress, cnpj, reference_id, description, installments, number, exp_month, exp_year, security_code, name} = request.body;
            const projectfind = await SignupProject.findById(reference_id);
            let pricerange = projectfind.generalprice;
            let pricediscount = projectfind.generaldiscount;
            let pricetotal = pricerange - pricediscount;
            
            //Define post
            let forms = {
                "reference_id": reference_id,
                "description": description,
                "customer": {
                    "name": customername,
                    "email": customeremail,
                },
                "amount": {
                  "value": Number(pricetotal),
                  "currency": "BRL"
                },
                "payment_method": {
                  "type": "CREDIT_CARD",
                  "installments": installments,
                  "capture": false,
                  "soft_descriptor": "FELIPEMDUARTE",    
                  "card": {
                    "number": number,
                    "exp_month": exp_month,
                    "exp_year": exp_year,
                    "security_code": security_code,
                    "holder": {
                      "name": name
                    }
                  }
                },
                "notification_urls": [
                  "http://www.felipemduarte.com/pagamento-aprovado"
                ]
            }

            function axioscredit(){
                const promise = axios.post("https://sandbox.api.pagseguro.com/charges", forms, {
                    headers:{
                        "Authorization": "48D51F6ED65A429EB989F63A0307E765",
                        "Content-Type": "application/json"
                    }
                });

                const dataPromise = promise.then((res)=>res.data);

                return dataPromise;
            }

            axioscredit()
            .then(data =>{
                SignupProject.findOneAndUpdate({"_id":reference_id}, {$set:{paid: true}},{new: true})
                .clone()
                .catch(err=>{
                    console.log(err);
                });
                let statuspayment = data.status;
                PaymentCreate.create({
                    rg, 
                    cpf, 
                    adress, 
                    cnpj,
                    paymentid:data.id,
                    description,
                    reference_id,
                    statuspayment,
                    price:pricetotal,
                    installments,
                    customername,
                    customeremail,
                }).catch(err=>{console.log(err)});
                return response.json({mensagem:"requisição recebida", data})
            }).catch((err)=>{
                console.log(err);
                return response.status(400).send({
                    error:"não foi possivel fazer pagamento",
                    mensagem: err
                })
            })
            
        }
        catch (error) {
            console.log(error);
            return response.status(500).send({
                error: "falhou em cadastrar conta",
                mensagem: error
            })

        }
    }

}

export default new CreatePaymentLink
