// import mongoose from "mongoose";

// const {Schema} =  mongoose;

// const newsSchema = new Schema({
//     title: {
//       type: String,
//       required: true,
//       trim:true
//     },
//     description: {
//       type: String,
//       required: true,
//       trim:true
//     },
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'CategoryNews',
//       required: true
//     }, 
//     url:{
//       type:String,
//       required:true
//     },
//     image_id:{
//       type:String,
//     }
//   },
//   {
//     timestamps:true
//   }); 
//   newsSchema.virtual("shortDesc").get(function() {
//     return this.description.substring(0,20)
//   });
//   const News = mongoose.model('News', newsSchema);
  
// export default News;

import mongoose from "mongoose";

const { Schema } = mongoose;

const newsSchema = new Schema(
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryNews',
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        image_id: {
          type: String
        }
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

newsSchema.virtual('formattedDate').get(function () {
  const options = { day: '2-digit', month: 'short', year: '2-digit' };
  return this.createdAt.toLocaleDateString('en-GB', options);
});

const News = mongoose.model('News', newsSchema);

export default News;