import jwt from "jsonwebtoken";
import SignupCustomer from '../database/schemas/SignupCustomerSchema.js'
const secretkey = '831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-';

function login (req,res,next){
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

export default login
