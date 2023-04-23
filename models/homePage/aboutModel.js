import mongoose from "mongoose";

const {Schema} = mongoose;

const homeAboutSchema = new Schema({
    titleName:{
        type:String,
        required:true,
        trim:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    desription:{
        type:String,
        required:true,
        trim:true
    },
    aboutIcons:[{
        icon:{
            type:String,
            required:true,
            trim:true
        },
        iconTitle:{
            type:String,
            required:true,
            trim:true
        },
        iconDescription:{
            type:String,
            required:true,
            trim:true
        }
    }

]

   


})
 const About = mongoose.model("About",homeAboutSchema);

 export default About;
