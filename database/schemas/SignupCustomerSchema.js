import mongoose from 'mongoose'

const SignupCustomer= new mongoose.Schema({
    nome: {
        type:String,
        required:true,
    },
    email: {
        type:String,
    },
    celular: {
        type:String,
    },
    encontradopor: {
        type:String,
    },
    instagram: {
        type:String,
    },
    referenciadopor: {
        type:String,
    },
    senha: {
        type:String,
    },
    senhaisdefault: {
        type:Boolean,
        default: true,
    },
    admin: {
        type:Boolean,
        default: false
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("SignupCustomer", SignupCustomer);
