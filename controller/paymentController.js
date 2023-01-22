import {request, response} from 'express';
import PaymentCreate from '../database/schemas/PaymentSchema.js'
import SignupProject from '../database/schemas/SignupProjectSchema.js'
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
import axios from 'axios';
import generator from 'generate-password';
import Cryptr from 'cryptr';
import { MailtrapClient } from 'mailtrap';
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

            async function saveDatabase(){
                await PaymentCreate.create({
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

            async function saveEmail(id){
                //Email variables
                //Create Link Confirmation
                let userId = id;
                //Add hours to date
                Date.prototype.addHours = function(h) {
                    this.setTime(this.getTime() + (h*60*60*1000));
                    return this;
                }

                //Encript
                let encrip = cryptr.encrypt(String(currentdate)+"--"+userId);
                let linkencrip = "https://felipemduarte.com/entrar/trocarsenha/"+encrip;

                //Format the data
                var currentdate = new Date().addHours(24);
                const TOKEN = "4269368e8b5d0b1e1f72da188d6b03be";
                const SENDER_EMAIL = "admin@felipemduarte.com";
                const RECIPIENT_EMAIL = findpayment[0].customeremail;

                const client = new MailtrapClient({ 'token': TOKEN });

                const sender = { name: "Não Responda", email: SENDER_EMAIL };

                await client
                .send({
                category: "pagamentoalterar",
                custom_variables: {
                    link: "",
                },
                from: sender,
                to: [{ email: RECIPIENT_EMAIL }],
                subject: "PAGAMENTO CONFIRMADO",
                html: `
                <!doctype html>
                <html>
                    <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body style="font-family: sans-serif; background-color:white;">
                    <img alt="" id="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADYCAMAAAAqGHQtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAuhQTFRFAAAAGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoasuooOgAAAPh0Uk5TAGn77uHd18y9u7SqmZCIh3dtZmNVSURAMyUiHBECw//41Muwp42DYEY8GQ8g/vTr0MetpImAXFM5MBUMe/HnzcS6oJd9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"/>
                    <h1 style="text-align:center; font-size: 18px; font-weight: bold; margin-top: 8px">PAGAMENTO APROVADO</h1>
                    <h2 style="text-align:center; font-size: 14px; font-weight: bold; margin-top: 16px">Entre no link abaixo e mude a senha para entrar
                    em nossa plataforma e ver detalhes e contrato preenchido</h2>
                    <img id="sent" alt="" src="data:image/png;base64,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" />
                    <p style="padding-top:32px">OU COPIE E COLE O LINK: ${linkencrip}</p>
                    <p class="bold" style="padding-top:32px">FELIPE M DUARTE - felipemduarte.com</p>
                    <a href="${linkencrip} style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;">ABRIR LINK DE ALTERAÇÃO</a>
                    <a href="" style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;"></a>
                    </body>
                    <style>
                    #logo{
                        width:52px;
                        height:auto;
                    }
                    #sent {
                        margin-left: 26%;
                        width:128px;
                        height: auto;
                        text-align: center;
                    }
                    h1{
                        margin-top:32px !important;
                        font-size:24px !important;
                    }
                    a{
                        margin-left: 22%;
                        text-align: center;
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
                    return res
                })
            }

            let customer = await SignupCustomer.find({"email":findpayment[0].customeremail})
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
                        nome:findpayment[0].customername,
                        email:findpayment[0].customeremail,
                        senha
                    })
                    let customer = await SignupCustomer.find({"email":findpayment[0].customeremail});
                    saveEmail(customer._id.valueOf());
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
                //email sender
                return response.json({mensagem:"requisição aprovada", paid:true})
            })
            .catch(err=>{
                console.log(err);
                return response.status(500).send({mensagem: "não foi possivel fazer o pagamento"})
            })
            //Email
            

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

                async function saveEmail(id){
                    //Email variables
                    //Create Link Confirmation
                    let userId = id;
                    //Add hours to date
                    Date.prototype.addHours = function(h) {
                        this.setTime(this.getTime() + (h*60*60*1000));
                        return this;
                    }

                    //Encript
                    let encrip = cryptr.encrypt(String(currentdate)+"--"+userId);
                    let linkencrip = "https://felipemduarte.com/entrar/trocarsenha/"+encrip;

                    //Format the data
                    var currentdate = new Date().addHours(24);
                    const TOKEN = "4269368e8b5d0b1e1f72da188d6b03be";
                    const SENDER_EMAIL = "admin@felipemduarte.com";
                    const RECIPIENT_EMAIL = findpayment[0].customeremail;

                    const client = new MailtrapClient({ 'token': TOKEN });

                    const sender = { name: "Não Responda", email: SENDER_EMAIL };

                    await client
                    .send({
                    category: "pagamentoalterar",
                    custom_variables: {
                        link: "",
                    },
                    from: sender,
                    to: [{ email: RECIPIENT_EMAIL }],
                    subject: "PAGAMENTO CONFIRMADO",
                    html: `
                    <!doctype html>
                    <html>
                        <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        </head>
                        <body style="font-family: sans-serif; background-color:white;">
                        <img alt="" id="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADYCAMAAAAqGHQtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAuhQTFRFAAAAGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoasuooOgAAAPh0Uk5TAGn77uHd18y9u7SqmZCIh3dtZmNVSURAMyUiHBECw//41Muwp42DYEY8GQ8g/vTr0MetpImAXFM5MBUMe/HnzcS6oJd9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"/>
                        <h1 style="text-align:center; font-size: 18px; font-weight: bold; margin-top: 8px">PAGAMENTO APROVADO</h1>
                        <h2 style="text-align:center; font-size: 14px; font-weight: bold; margin-top: 16px">Entre no link abaixo e mude a senha para entrar
                        em nossa plataforma e ver detalhes e contrato preenchido</h2>
                        <img id="sent" alt="" src="data:image/png;base64,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" />
                        <p style="padding-top:32px">OU COPIE E COLE O LINK: ${linkencrip}</p>
                        <p class="bold" style="padding-top:32px">FELIPE M DUARTE - felipemduarte.com</p>
                        <a href="${linkencrip} style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;">ABRIR LINK DE ALTERAÇÃO</a>
                        <a href="" style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;"></a>
                        </body>
                        <style>
                        #logo{
                            width:52px;
                            height:auto;
                        }
                        #sent {
                            margin-left: 26%;
                            width:128px;
                            height: auto;
                            text-align: center;
                        }
                        h1{
                            margin-top:32px !important;
                            font-size:24px !important;
                        }
                        a{
                            margin-left: 22%;
                            text-align: center;
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
                        return res
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
                        let customer = await SignupCustomer.find({"email":paymentfind[0].customeremail});
                        saveEmail(customer._id.valueOf());
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

                //email test
                const TOKEN = "4269368e8b5d0b1e1f72da188d6b03be";
                const SENDER_EMAIL = "admin@felipemduarte.com";
                const RECIPIENT_EMAIL = "contato@felipemduarte.com";

                const client = new MailtrapClient({ 'token': TOKEN });

                const sender = { name: "Não Responda", email: SENDER_EMAIL };

                client
                .send({
                category: "pagamentoalterar",
                custom_variables: {
                    link: "",
                },
                from: sender,
                to: [{ email: RECIPIENT_EMAIL }],
                subject: "PAGAMENTO RECUSADO",
                html: `
                <!doctype html>
                <html>
                    <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    </head>
                    <body style="font-family: sans-serif; background-color:white;">
                    <img alt="" id="logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADYCAMAAAAqGHQtAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAuhQTFRFAAAAGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoaGhoasuooOgAAAPh0Uk5TAGn77uHd18y9u7SqmZCIh3dtZmNVSURAMyUiHBECw//41Muwp42DYEY8GQ8g/vTr0MetpImAXFM5MBUMe/HnzcS6oJd9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"/>
                    <h1 style="text-align:center; font-size: 18px; font-weight: bold; margin-top: 8px">PAGAMENTO RECUSADO</h1>
                    <h2 style="text-align:center; font-size: 14px; font-weight: bold; margin-top: 16px">Não se preocupe, você poderá tentar efetuar um novo pagamento, entre em contato
                    com sua agência de banco para tentar entender os motivos.</h2>
                    <img id="sent" alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTExIiBoZWlnaHQ9IjExMSIgdmlld0JveD0iMCAwIDExMSAxMTEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNDE0XzczKSI+CjxyZWN0IHdpZHRoPSIxMTEiIGhlaWdodD0iMTExIiBmaWxsPSJ1cmwoI3BhdHRlcm4wKSIvPgo8ZWxsaXBzZSBjeD0iNTciIGN5PSI1NSIgcng9IjM1IiByeT0iMzMiIGZpbGw9IndoaXRlIi8+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMV80MTRfNzMpIj4KPHBhdGggZD0iTTc0LjY2NDMgMjguMDAzMUwyNy45OTc2IDc0LjY2OTlMMzcuMzMwOSA4NC4wMDMzTDgzLjk5NzcgMzcuMzM2NUw3NC42NjQzIDI4LjAwMzFaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNODMuOTk3OCA3NC42N0wzNy4zMzExIDI4LjAwMzJMMjcuOTk3NyAzNy4zMzY1TDc0LjY2NDUgODQuMDAzM0w4My45OTc4IDc0LjY3WiIgZmlsbD0iYmxhY2siLz4KPC9nPgo8L2c+CjxkZWZzPgo8cGF0dGVybiBpZD0icGF0dGVybjAiIHBhdHRlcm5Db250ZW50VW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIj4KPHVzZSB4bGluazpocmVmPSIjaW1hZ2UwXzQxNF83MyIgdHJhbnNmb3JtPSJzY2FsZSgwLjAwNDY3MjkpIi8+CjwvcGF0dGVybj4KPGNsaXBQYXRoIGlkPSJjbGlwMF80MTRfNzMiPgo8cmVjdCB3aWR0aD0iMTExIiBoZWlnaHQ9IjExMSIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPGNsaXBQYXRoIGlkPSJjbGlwMV80MTRfNzMiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iNTYiIGZpbGw9IndoaXRlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyOCAyOCkiLz4KPC9jbGlwUGF0aD4KPGltYWdlIGlkPSJpbWFnZTBfNDE0XzczIiB3aWR0aD0iMjE0IiBoZWlnaHQ9IjIxNCIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFOWUFBQURXQ0FNQUFBQ2FQWXdjQUFBQUFYTlNSMElCMmNrc2Z3QUFBdmRRVEZSRkFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFsQXpncGdBQUFQMTBVazVUQUNWTGNvaVZvcTY3eU5UaDd2OXhKQlU4WTRtdzF2bXZZanNVQlRpczV1V3JjRFlUVDhQMzlzS0hUUkljZFA3SEhuWEtjM2JMeVF6TkdJcndLcUg2bnlkRXVMWkJCRnZQV0FORDNkb2l0YkVMK0lZQllPY3oyTHFiZjJGU05TWVhuTm5HTHhhZG1HOVIvWkpVME8xSmp1eE1EUTZQSGN5b1Nxa2JaY1NGSDJnSDJ6VEZNSzA2OWNBci9IN2MzbmNDOG5qemxwNFAwV3NHQ2xaY2d5QWpnSTFPKzBidjZTM2Y0a2ZWR3RmcnZJSDBNWHhDU09oVkVLZVVOOEZxaTVDUkx0Tlp0T1RqV3VvL3NpR1RFWGxUYWJPWFhRbFhtcU5lVU9CbmJOS0V0NEtsT1Q1N3ViODk4UWdvdnFha1ppeWdiVEtxUUJsZm1YMWtlb3pPS2ZaYWFyQUFBQThvU1VSQlZIaWN6WjFwWUJSRkZzZUxIRUNPaG5CRkl4NUVCSlFqc0tCQjdyRGNpQklKQWtKZ3VDV0JTQWlDQWlJaEhoRVdEWUlpZUhDSm9yRHhkbEZjWEZUd1JGYU4xN29pN0xxdW9LdDdlYTM2WVdlU21URHozcXVydTZxSC84ZnE2bGZ2bCtsMDEvSHFGV05XMVNBaE1TbTVZYVBHS2FscDZZNlRucGFhMHJoUncrU2tKZ2xON2JaclN4bk5tcmRvMlNyVDRTcXoxV2xKcDJlZEVXOC8xZFg2ek1Tenp1Ynp4T3FjTnRubnRvNjN4MUsxUGE5RnUvYXFTQkYxT1ArQ2pwM2k3VGxmbmJ1azZCTFZLNmRyazg3eDlwOVN0MTkxZDgwVVZrcVBVNHlzMjRVWGVXV3FVMjZYYnZGbWlhaG40c1ZtbU9wMFVXTFBlQk1GMWF0M0g1TlFJZlZKNmhWbnFMNzkrcHVHQ2lselFGNGNvUWIrMmdaVG5RWU5qZy9Ua0tIRDdFR0ZkUEh3RWY1VGpiekVMbFJJbzBiNkRIWHBaZmFoUWhwOXFZOVErYjBGZlZpenVueE12azlRQldPdjhBc3FwSE9HK2tJMUxsZkRwdzdqSjF3NU1YdFM0Y2pKVXdLTUJhWk1IbGc0S1h2aTFBblRPbWdZbVQ3RE90VE1XWXErVEp0OTFaeHhHWHhER2VNS3MyZVBValEyeS9LNExFR2xTMUUwckhodVd6VjdHWE9MNXhVcG1DeTUyaWJWZkxrRHBmTVhsT2taWGJqZ21sSzUzUloyaUlKYXRGaldkdnRycjNQMUNSMXgzUkxwNEROM3FXbWVPa2tmd0hiTE5IK25hSlV0dTE1aTNzNkRLSGtBUzViZjRMV0ZHNWFYaU51NHhnUkhqQmJORXpZNGFrVzVpVmJLVjZ3VU5wTnJlSkJaSWZ3NzNqaW53RlJEQlhPbWkxb3F1Y2xVUXlGZExmaUhMcnE1d21SVGpOMXltdUNWWHpuUVhFTkRCZTNjdXNwY094R3RFcnc5Vmh2clMvMkczOGlhT2FZYWlWWGhiZncyYnpmU1FoVy91N1QyZG1zVHN1VjNyT00ydTk3QWYzTDVJSjcxb2xrenZadm5hK2FkT2J5V1c1WjdOWDRYOThWMHZmVis5UXp1SlBGMEQ5LzlrTW8yOEN6ZmJjWjFzYko1cmMvenhMV3hIY2ZzR2d2dlAwb3oxbkFjYUxmUnZkR3EwUnlqQXphWjgxeXNUVXM0TG95dWNtMXpLbTF4M1QwRy9aYnFYczRyY2FwYmcvZlI5aGJmYjlCcEJXM21kRWUzdURQWG5EU1dzM1dJV2EvbGFuME56ZFhjamJGdFpJOXArM0RUVHF0b09PbEwwVFo5UzgzSXFjQU9ENWozV1VVTExxZTh5V3ltYTJmcERzck8ybk50K0t5aXJMV1VQenMwbHkrSGtDdW1EejVreDJjVlBVUk80K1RxdmVaN1V6WjIrdndLakZYVGh5bWZsdXVZZUlTeXNDdk9hNFM3ZjB0NXBiR29FcUIrOExTQVBZOFYzVW9qM0twV252Q3RvZ2FucFp0dGVxeW16ZFNmKzFIVjBkZGp4TTJQUDJIVllVVTlRYzJwUEtsMmJ4WXhmTnYrbEYxL1ZmWDBhdXhia2RMWHErMHorTTZjMzluMlYxWDNFai9YRlhzVWJueVd1TkdYTWFPYWJpZmNheWkvTFl1NHJiZDliOVgxSE9IZ1h0bE5CY1RINFZFL3ZGVld3ZlBZdzJHeXQrSHY4VDNxWHdaLzFLc2ErN2hNZk1zZW9vZnJkM0NFVkFPeGorbmlLWnYxK0k1OVBqbXJvUmV3bDM4UTFkK1BQMW5EZkI4TXk3WHhSZVRtNnI2QytuZzRVaG5YWGp0UFV4NUhqajdQci8wUy9uSGpNc2FYYXhMMmRDNnY3aVljNXYyeW43N3FhQUp5TmEyY1U3VUxxdHJmejBncUxUWEZuY09yNkpwRERxQ2FGL2pycTQ2MkltY1AwaE1BcjZDS1ovczJKdzNVUzc0RnBleFY1QzdkSDhlTEkvN0VobUVGVmg2VVIwT01SZTZtVU5WZVE5VzZHL2RYVFlHVndTZEt6b1ZYdjI0aGFyME9LK1hzTis2d2tnSzFzUmx5cnBzUTFzMjQwaHVvZ3pIYmhzOXlCY0lSSjNLdU82SEhSZmpGUFJ2V3lSUUVBMXBVb0Q2T1JzcTFkRHYwK1UxWTVSQ2FjcDlxeDIySkFsSFJRVkt1ZnREblNyaGY2aTMwb0RhdzVibElnWmlZSnhsWFgrVDBoYUFHaW1wdmFjMTFnUUlna2t2R2hjTFdYNHk5L2hEaU5oeklwQ1JJSmVYQ0g2WFlaMnc1dk56T3B2c2NZU29wRnhwSjNSZHorU0M4M05HbS83UW9LaG5YWVZoOVZQVFZjK0hWYWNZQ0JKVkZVd1c1UkRHNlZiZkI2dU9pcnFLQVZjbE1qZ1dkd1kzNzNDbmkraU9zSFRXbldmQWd1TmJmWTB5UnZzNGdGNi9rWEozZ3VDdnQ1RFgwUW5uYlBrZXNSRlJpTHZTT1A5bmZmUWRlOG50RUlxWVNjcjBMNnhiWFg0STdmRHJVK01GeVVqSXFFVmNaN1BWZEVybHlBelRTeGhlWWVzbXBSRDlYSTFoM2QvZ0MraDBQKzRNVGxqY3E5aDZzL0ZMNHd2dWdmSzJ2S1JFOFVyRWF1QlZzZmZqQ2VGRCtnUjgwRVNsUUNUL0lqRjBMcXFmV0ZYZmkvWXArU0lWSzBvMy9FTjVRdDNlc0VCYjdHRlppZ0lxOUFlLzRxTFlZTHF2OHlUNU5SQ2FvR0RzSDNESy90aFRtVC9Edlg4c01GZnJuV2h3cTdBbERFRCsyVFJQUklUTlU3TS9ncHFKUWo3WVpOQ1ZhQURPcFE1K1lvY0lUaHFGdUlaejBYV2VaSmlKalZLd0tobEIrR0N3OEFzcEc2L2pXMC9XVVJ5YzUxUUhWWmFoUHdZMUhHZjZIZTB6RHQveVVkUzdEWE0zOVZrR05BWGNlQzViQlhiZnZxdnVXbnhKOFpsMXhHYVZpcDROYmM0TmxjRlBBWDVTdDVkZXVXYmpoTWt2Ri9ncnVMUTErTzZBOTVaaVovUEJLakQ2WFlTcTJHOTY5aDUwSlNwUmZoUG4xNjB1NlhBcFVWK2h0WW9aUjhoVW9RRyt4TnBVdWx3cVZaZ1F0WEVoOWoyMEJKZGZxVStseFdhQmlOd01EbjZGMXJmdmtSaENWRHBjTkt0WUNXQ2htSDRBU3BVQlBTS1hPWllVS2JUYThFODF3Zk9pS1NwVnJvUlVxdENkckNmc2JLRkhZSDAxUnFYRXRsQ2VSYzBQRjdnRkdYbVl3bEYrK1o1Nm1VdUd5UmNXdUJsWStaM0NIbmpTYXQ0YTdHMWpHWlkySy9SMlk2YzdnUW9Wc3RGWEQyN01yNWJKSGhVWmNyUmdNdHBNazJoQlJpYmtzVXJITndGQWErd0tVSFBKQUplS3lTY1ZtQWt1bEROcjJSTVhuVXFCNjFmMmVveHBncWoyRDJTQ0ZFOVhIYjVRNlIzT3BVT1c1cG1JYmdhMU1sZzVLeEEraFN5N0xWR2hpdW9UQkhZZUx4QVpjY2RtbVl0MkF0VFRXQ3BTY2tGaHd3V1dkQ2tVSjdVSUJHOUtwSkcwdSsxUW9BQ09GZlFsS1hwUGEwT1RLdDAvRm5nSUdIMFZCbndseUkxcGN2QjZrU1NxMkRWaHN5YjRDSmU4cFdOSGc4b1VLQllYL2cxMEpTazVYTWFQTTVROFYreHJZZklmQlhCU2ZLZGxSNVBLSmlrMEVSdmVoTFpUOTFBelZLSER0OVl1S0hRTldlNkRRdGE2S2xqWVJXeFFobC93ZFdHMW0xUWxtb3orUHpRQWxwYXFtRko1RHFVcnlqRkNoQ2ZkVnFQUHJMUFNQcStRYk0xUndYT0tVTXdZM2haK3BiTTBybHlrcXRLQjZJRmdHNTJoVVp0U01jQm1qUWd0QnR3YkwvZ25Lam1qWTg4Smxqb29sQWROVGcyVlBnckxMZEF5NjV6SkloZVk2N3dpV0RRZGxhN1d5MXJqbE1rbFZCYk5vaEhaL1ZzQVc5WktodXVNeVNVVVRISWY3YXY2bFo5UU5sMUVxMWdSWTMxNjdBeHptaTJ5amFWV2Z5eXdWT3cyWVA3KzJGTDVIbFBzWmJya01VN0VTWUwvdVhaNEFtOVhlNHFUSFpab0tiWGQ2cExhNERNWnk2U2ZJMCtFeVRjVStCZzBVaGM4WWdvc214TTVKbWRTNStwaW1ZakNUNTBYaDhtSlFudWtpREY2VnE0L3hmRkZsY0Y1NmZ2akNYTmoyS3k2c3EzR1pwOEtodWgrRkw3U0ZGMXh0SUZUaHNrQ0ZONW5VYi91Y0JpNWt1dG9ReE51QWRWTGJMV3gySzROYmduYlZYMElwUXpVR0oxR1NjZG1nUW9PU3FBMWNlK0VsbDlrL3hGeFdxQmc2QWl4cXV4MU0vT2Z1S1JSejJhRTZCSi9CaDZNdXd2NlQ4N1hMVnZoY3ErMXNJbDBCMjRrZUJmOGJYaHp2ZHN0bllDZUh5czR1b3dMNHRuUDJSMTlHWnhBcHJERFFXa3B5V2FKaUhXRkRLMk11dy9EcTJsa09kNks0YkZHeDgyRkxzWW1zdjBHZTdIZmRGT2F5Um9YR3hRNUlZb09ld2lYdUc0TmMxcWpZV2REckRhRENXNGpidzVFL3NWejJxR0R3REQ0TTVCQTZsYTJZdEtTbWFDNTdWRGcvWHdjVWZ2R212SXFHVG5KWnBNSVpXZkJQOFFaS3VlNHBNV0dFeXlJVlRsTll0QnRYK2crczFOL1Q2ZXgxWERhcFRxQTBhbFJVK0dSWXlabmdxZFVRbDAwcXRDYmlPT1I4QWw1ZVhPQ3AyYVU3clZMTlFlNStTZFpESFJGbnBiZDkxZDMrNitsMnNjcHhlbmo2N0xzQ3VLM2ExSmxRVmdRWGVoeG5HcWNtUHVHak1qNlp1UlQwYlNWeTlqdE8xZFo0c0tTUURUbyt3cG0xTCtHZVdJbW1yUjNuT2o5OVZkZlQyRk5CVm1PY0tIUkh2QTloSjBVY1IvSzZvRHFSS0xTZCs1T1RyS2tLNS84VkoxOGxUdU9aNkplejZrS0RYbGx1OXpJWWtheWE4OTlQRWFjbVZFdW15dUNxaXFPWTg5OUhVYWNteU1JRkMzYmhlN1JDR3V3TGh1RUd0VUU2VVFiMzhJWTB4Zzl2VmJXUGNIQ3kvRFkwUUhGT3FTTWswSHhuVUY4cDNFZmwvRDkxRHZ3NFRCeXk4b3pTd2VVamliL0hxWEk4eXdNb09XdndiNTZsZGk5MVN0V3BjWmpPWk9vd0hkV3pxb2JrRWplZkNrY2ZUYUdPY091dTNBM3FUSjI0RnYrRHFuYkRGRUVoN2RBNEVCNFBxSU5LL2RhZXh5cnFSWHhTSFVmck5NTHZLUXNQZTVxSzhxbzhsSFkxcE9lMGJCeFBwV3lVeHUwZ1FzWXErbEFlN2RLY2JXbEFIb29lcjJNamVZZTBWMm8vUDV4RFBua1RCcFpGSDlLKzJzVmZtVDZTRlNXNzlrVS8wTDY0U3MxM0IyM3JUZDh6Q1Jkd0Rtbm5uUEFoRTNXQVYxQmYrdndCKzVZWWlZVFV3cVc5QXBnaUpLeHFYMThjQ1hqQVhpdVZianV0RVRDTFYwUXZsSnR6VzZ6eVpJNExiM09uQmVVNlR2VU9RMHJOTSthNFVLdkk3MmRRTjNvNElwMnhQVHl6emdwVG5vc0VNdy9XYTRQeXZpVmFlM2kvbDNPcmJPTzFaNjJpRGxHdDFmUzd2TnF1ZVp0bmUzV3haK01pZFZwUG5PaFpwMEhsM3MxWHdTMURKMVg5dGJVcDM2cTdTN2pOempMVDZsRnVBMDZxTkhXTk8yVngvNmYxRWlnS3RZeVlGNG5vS3d1anNNN1U3RmRZUlVvYm85VlVDSU95bzlUKy9UeHpEWVhVZHhaNXpIdWRMcWRYVWwxcU1IbndlbGc1bjhxVFF5bnJhYmpITEVacjFaTkNLbW16NEdFUDZwTkpuajZQRVpYL1NBN3M2elhQL0R3UnArTWJVZlZSejAwMkdGTWlibU8rM0lhK0VzaGhkL1RmOGkxSmtpaVJ1djBQSDBJWHEzVFhFYWxpTGVvcWFkaHh1aWNTWVVkeTdlNEN0NjlqZGJVMjhUWGlDRG4yamxGT2F2STlTblBpRVdVTWZ3Zm13eUZVZE5SRGoxMnF3Y1NTR2FIeDM3ODBVOFZjcjZIdm85Qm9VczlZWGhMTkVMNS9ZOURhSEJsN0N6ZWJiVWJXMkNObjRiQWRqZ2JaUDBuNk8yckttS3YwbElaYnNpY1ZEcTZZRW1ESEExTW1EejQ4S1h2TEI3blVaRHBYQjMwNUxXYlRZeWdBMXFZcUp4NzNneXFvenRTaDkzYVVjOHpQbWYrOU1JRzNKUzIyTkVMZ3FlQTdmRGl5Y1IxNDEvL1R6V3BXcUwyYlhXdjh4K1crUTRWVXNFMmVac2UxUHUvby95OVZyeWVlSmRhb3ZXdjdzWGd2VlhmZUtocUt1ZElYUDducVdCcld3aDQvbTRUNk9iRm52SWtpYXZxRGVQaW5yTlFuNzQ4M1M2eStPYkxHSzlQS0k4YjMrNXRReFU4NE5sMVphZnZHeVZ1SWwwNzhPRUM2Vnh4cjFJRG1lZkgyWEtxTXd2bmRsVi83L1hPM3p0RWFkY1pWclU4c2FMSit3azdCWUxyb3RnbkpUUmJrK1hxTW5qSDlzcTFIVW5MRFJvMVRVdFBTSGFja0xiVnI0MGI5a3BNU3QvMWl0OTMvQTg1L3hFWU1IWmpvQUFBQUFFbEZUa1N1UW1DQyIvPgo8L2RlZnM+Cjwvc3ZnPgo=" />
                    <p class="bold" style="padding-top:32px">FELIPE M DUARTE - felipemduarte.com</p>
                    <a href="https://felipemduarte.com" style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;">VOLTAR PARA WEBSITE</a>
                    <a href="" style="color:white; background-color:black; padding:8px 16px; text-transformation:none; text-align:center;"></a>
                    </body>
                    <style>
                    #logo{
                        width:52px;
                        height:auto;
                    }
                    #sent {
                        margin-left: 26%;
                        width:128px;
                        height: auto;
                        text-align: center;
                    }
                    h1{
                        margin-top:32px !important;
                        font-size:24px !important;
                    }
                    a{
                        margin-left: 22%;
                        text-align: center;
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
