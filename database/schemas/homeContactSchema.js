import mongoose from 'mongoose'

const HomeContact = new mongoose.Schema({
    nome: {
        type:String,
        required:true,
    },
    sobrenome: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    mensagem: {
        type:String,
        required:true,
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("HomeContact", HomeContact);
