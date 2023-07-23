const { Schema, model,ObjectIdSchemaDefinition:ObjectId  } = require('mongoose')

const payment_details_Schema = new Schema({
    order_id :{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        default:0
    },
    provider:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = model.Payment_details || model("Payment_details", payment_details_Schema);
