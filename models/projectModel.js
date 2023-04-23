import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    project_title:{
        type:String,
        required:true,
        trim:true
    },
    
    project_description:{
        type:String,
        required:true,
        trim:true
    },
    language_id:{
        type:String,
        required:true,
        trim:true
    },
    uploadedAt:{
        type:Date,
        default:Date.now,
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    url:{
        type:String,
        required:true
    }
})

const Project =mongoose.model("Project",projectSchema);

export default Project;


///language table
//name
//id
// 1