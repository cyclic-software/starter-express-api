const { Schema, model,ObjectIdSchemaDefinition:ObjectId  } = require('mongoose')

const Order_details_Schema = new Schema({
    user_id :{
        type:String,
        required:true,
        unique:false
    },
    total:{
        type:Number,
        default:0
    },
    payment_id:{
        type:Number,
        required:true
    }
},{timestamps:true})

module.exports = model.Order_details || model("Order_details", Order_details_Schema);
