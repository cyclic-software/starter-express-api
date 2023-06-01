
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    titleAz: {
      type: String,
      required: true,
      trim: true,
    },
    titleGe: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionAz: {
      type: String,
      required: true,
      trim: true,
    },
    descriptionGe: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl:{
        type:String,
        required: true,
        trim: true,

    }

  },
  {
    timestamps: true,
  }
);

mongoose.plugin(mongoosePaginate);

const Project = mongoose.model('Project', projectSchema);

export default Project;