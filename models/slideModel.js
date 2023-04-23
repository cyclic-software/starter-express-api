import mongoose from "mongoose";

const Schema = mongoose.Schema;

const slideSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim: true,
    },
    description:{
        type:String,
        required:true,
        trim: true,
    },
     

});

const Slide = mongoose.model("Slide",slideSchema);

export default Slide;