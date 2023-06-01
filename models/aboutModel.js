import mongoose from "mongoose";



const { Schema } = mongoose;

const aboutSchema = new Schema({
  titleAz: {
    type: String,
    default:"na"
  },
  titleGe: {
    type: String,
    default:"na"
  },
  descriptionAz:{
    type: String,
    default:"des"
  },
  descriptionGe:{
    type: String,
    default:"des"
  },
  url:{
    type:String,
  },
  image_id: {
    type: String,
  },
  fb:{
  type:String,
  default:"https://www.facebook.com/"
  },
  inst:{
    type:String,
    default:"https://www.instagram.com/"
  },
  youtube:{
    type:String,
    default:"https://www.youtube.com/"
  }
}
);




const About = mongoose.model('About', aboutSchema);

export default About;