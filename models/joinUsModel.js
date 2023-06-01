import mongoose from "mongoose";

const { Schema } = mongoose;

const joinUsSchema = new Schema(
  {
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
    files: [
      {
        url: {
          type: String,
        },
        file_id: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const JoinUs = mongoose.model("JoinUs", joinUsSchema);

export default JoinUs;