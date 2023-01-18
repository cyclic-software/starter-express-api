import mongoose from 'mongoose'

const PaymentCreate= new mongoose.Schema({
    reference_id: {
        type:String,
        required:true,
    },
    rg: {
        type:String,
    },
    cpf: {
        type:String,
    },
    adress: {
        type:String,
    },
    price: {
        type:String,
    },
    installments: {
        type: String,
    },
    customername: {
        type: String,
    },
    customeremail: {
        type: String,
    },
    description: {
        type:String,
    },
    criadoEm: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("PaymentCreate", PaymentCreate);
