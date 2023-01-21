import {request, response} from 'express';
import PaymentCreate from '../database/schemas/PaymentSchema.js'
import SignupProject from '../database/schemas/SignupProjectSchema.js'
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import axios from 'axios';
import generator from 'generate-password';
import Cryptr from 'cryptr';
const cryptr = new Cryptr('831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-')

class CreatePaymentLink {
    async charge(request, response){
        try{
            const {paymentid} = request.body;

            //catch the last payment 
            let findpayment = await PaymentCreate.find({"paymentid":paymentid})
            .sort({criadoEm: -1})
            .catch((err)=>{console.log(err)});
            console.log(findpayment);
            console.log(findpayment[0]);
            if(findpayment[0] === undefined || findpayment[0] === ""){
                return response.status(500).send({mensagem: "Pagamento não encontrado"})
            }

            //If payment is already paid
            if(findpayment[0].statuspayment === "PAID"){
                return response.status(500).send({mensagem: "Você não pode dar charge duas vezes"})
            }

            //If authorized capture the charge 
            if(findpayment[0].statuspayment !== "AUTHORIZED"){
                return response.status(500).send({mensagem: "Você apenas pode dar charge se autorizado"})
            }

            //Then charge the price
            function axioscapture(id){
                let forms = {
                    "amount":{
                        "value": findpayment[0].price
                    }
                }
                const promise = axios.post(`https://sandbox.api.pagseguro.com/charges/${id}/capture`, forms, {
                    headers:{
                        Authorization: "48D51F6ED65A429EB989F63A0307E765",
                        "content-Type": "application/json",
                        accept: "application/json"
                    }
                });

                const dataPromise = promise.then((res)=>res.data);

                return dataPromise;
            }

            function saveDatabase(){
                PaymentCreate.create({
                    rg: findpayment[0].rg, 
                    cpf: findpayment[0].cpf, 
                    adress: findpayment[0].adress, 
                    cnpj: findpayment[0].cnpj,
                    paymentid:findpayment[0].paymentid,
                    description:findpayment[0].description,
                    reference_id: findpayment[0].reference_id,
                    statuspayment:"PAID",
                    customeremail: findpayment[0].customeremail,
                    price:findpayment[0].price,
                    installments: findpayment[0].installments,
                    customername: findpayment[0].customername,
                })
                .catch(err=>{
                    console.log(err)
                })
            }

            let customer = await SignupCustomer.find({"email":findpayment[0].customeremail})
            function saveUser(){
                if(customer[0] === undefined || customer[0] === ""){
                    var Senha = generator.generate({
                        length:10,
                        numbers: true,
                        lowercase: true,
                        uppercase: true,
                    })
                    const senha = cryptr.encrypt(Senha)
                    SignupCustomer.create({
                        nome:findpayment[0].customername,
                        email:findpayment[0].customeremail,
                        senha
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                }
            }
            //Charge
            axioscapture(paymentid)
            .then(res=>{
                console.log(res);
                //Create new payment record
                saveDatabase();
                //Create user
                saveUser();
                return response.json({mensagem:"requisição aprovada", paid:true})
            })
            .catch(err=>{
                console.log(err);
                return response.status(500).send({mensagem: "não foi possivel fazer o pagamento"})
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
    async changestatus(request, response){
        try {
            const {id,status} = request.body
            
            //Check values was sent
            if(!id || !status){
                return response.status(400).send({
                    error: "Preencha todas informações.",
                })
            }
            
            //Find the payment history by the last document
            const paymentfind = await PaymentCreate
            .find({"reference_id":id})
            .sort({criadoEm: -1})
            .catch(err=>console.log(err));
            
            //If there is no payment history
            if(paymentfind[0] === undefined){
                return response.status(400).send({
                    error: "Nenhum pagamento foi criado ou projeto foi pago.",
                })
            } 
            let paymentid = paymentfind[0].paymentid;

            function axioscapture(id){
                let forms = {
                    "amount":{
                        "value": paymentfind[0].price
                    }
                }
                const promise = axios.post(`https://sandbox.api.pagseguro.com/charges/${id}/capture`, forms, {
                    headers:{
                        Authorization: "48D51F6ED65A429EB989F63A0307E765",
                        "content-Type": "application/json",
                        accept: "application/json"
                    }
                });

                const dataPromise = promise.then((res)=>res.data);

                return dataPromise;
            }

            //If was in-analysis and went to authorized
            if(status === "PAID"){
                if(paymentfind[0].statuspayment === "PAID"){
                    return response.status(400).send({
                        error: "Valor não pode ser cobrado duas vezes.",
                        mensagem: error
                    })
                }
                //Create an user
                let customer = await SignupCustomer.find({"email":paymentfind[0].customeremail})
                async function saveUser(){
                    if(customer[0] === undefined || customer[0] === ""){
                        var Senha = generator.generate({
                            length:10,
                            numbers: true,
                            lowercase: true,
                            uppercase: true,
                        })
                        const senha = cryptr.encrypt(Senha)
                        await SignupCustomer.create({
                            nome:paymentfind[0].customername,
                            email:paymentfind[0].customeremail,
                            senha
                        })
                    }
                }
                //Charge the price
                async function saveDatabase(res){
                    await PaymentCreate.create({
                        rg: paymentfind[0].rg, 
                        cpf: paymentfind[0].cpf, 
                        adress: paymentfind[0].adress, 
                        cnpj: paymentfind[0].cnpj,
                        paymentid:res.id,
                        description: paymentfind[0].description,
                        reference_id: paymentfind[0].reference_id,
                        statuspayment:"PAID",
                        price: paymentfind[0].price,
                        installments: paymentfind[0].installments,
                        customername: paymentfind[0].customername,
                        customeremail: paymentfind[0].customeremail,
                    })
                    .then(doc=>{
                        return doc
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
                axioscapture(paymentid)
                .then(res => {
                    console.log(res);
                    //Save payment history
                    saveDatabase(res).catch(err=>console.log(err))
                    //Create user
                    if(customer[0] === undefined || customer[0] === ""){
                        saveUser().catch(err=>console.log(err));
                    }
                })
                .catch(err=>{
                    console.log(err);
                    return response.status(500).json({mensagem:"requisição não aprovada",error:err})
                })
                //Send email
                //Aprove
                return response.json({mensagem:"requisição aprovada", paid:true})
            }

            if(status === "DECLINED"){
               await PaymentCreate.create({
                    rg: paymentfind[0].rg, 
                    cpf: paymentfind[0].cpf, 
                    adress: paymentfind[0].adress, 
                    cnpj: paymentfind[0].cnpj,
                    paymentid:paymentfind[0].paymentid,
                    description: paymentfind[0].description,
                    reference_id: paymentfind[0].reference_id,
                    statuspayment:"DECLINED",
                    price:paymentfind[0].price,
                    installments: paymentfind[0].installments,
                    customername: paymentfind[0].customername,
                    customeremail: paymentfind[0].customeremail,
                }).catch(err=>{console.log(err)});

                return response.json({mensagem:"requisição mudada para Declined", paid:false})
                //Send email
            }

        }
        catch (error) {
            console.log(error);
            return response.status(500).send({
                error: "falhou em cadastrar conta",
                mensagem: error
            })
        }

    }
    async check(request, response){
        try {
            const {id} = request.body;

            //If not found the payment
            const paymentfind = await PaymentCreate
            .find({"reference_id":id})
            .sort({criadoEm: -1})
            .catch(err=>console.log(err));
            if(paymentfind[0] === undefined){
                return response.status(500).send({
                    error: "Nenhum pagamento foi criado ou projeto foi pago.",
                })
            } 

            let status = paymentfind[0].statuspayment;
            let paymentid = paymentfind[0].paymentid;
            let paymentDate = paymentfind[0].criadoEm;
            let customerEmail = paymentfind[0].customeremail;
        
            return response.json({
                mensagem:"Requisição feita com sucesso", 
                statuspagamento: status,
                pagamentoid: paymentid,
                pagamentodata: paymentDate,
                email: customerEmail
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
                let statuspayment = data.status;
                console.log(data);
            if(data.payment_response.code === "20000"){
                    //Save on database 
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
                        customeremail:String(customeremail),
                    }).catch(err=>{console.log(err)});
                    //Return response
                    return response.json({mensagem:"requisição recebida", id: data.id, status:data.status}) 
                } else {
                    return response.status(500).send({
                        error:"Ocorreu um erro ao tentar fazer a cobrança",
                    })
                }
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
