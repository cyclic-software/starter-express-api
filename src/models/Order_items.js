const { Schema, model,ObjectIdSchemaDefinition:ObjectId  } = require('mongoose')

const Order_items_Schema = new Schema({
    order_id :{
        type:String,
        required:true,
        unique:false
    },
    product_id:{
        type:String,
        default:0
    },
    quantity:{
        type:Number,
        required:true
    }
},{timestamps:true})
  
module.exports = model.Order_items || model("Order_items", Order_items_Schema);
