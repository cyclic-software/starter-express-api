import mongoose from "mongoose";

const {Schema} =  mongoose;

const categorySchema =new Schema({
    catNameAz: {
      type: String,
      required: true,
      unique: true
    },
    catNameGe: {
      type: String,
      required: true,
      unique: true
    }
  });
  
  const CategoryNews = mongoose.model('CategoryNews', categorySchema);
  
  export default CategoryNews;






