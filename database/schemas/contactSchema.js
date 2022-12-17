import mongoose from 'mongoose'

const LeadContact = new mongoose.Schema({
    nome: {
        type:String,
        required:true,
    },
    profissao: {
        type:String,
        required:true,
    },
    procura: {
        type:String,
        required:true,
    },
    cellphone: {
        type:Number,
        required:true,
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("LeadContact", LeadContact);
