import jwt from "jsonwebtoken";
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
const secretkey = 'fa1r90ur@:5513616na-sigileauth-@:public=481905uri1nfaon0@8felipemd';

function customer (req,res,next){
    try {
        const token = req.headers.authorization;
        if(!token || token === undefined){
            return res.status(401).send({
                msg:"Autenticação negada"
            })
        }
        const decode = jwt.verify(token, secretkey);
        req.usuario = decode;
        next()
    } catch (error) {
        return res.status(401).send({
            msg:"Falha na autenticação"
        })
    }
}

export default customer
