import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";


const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default:""
  },
  surname: {
    type: String,
    default:""
  },
  descriptionAz:{
    type: String,
    default:""
  },
  descriptionGe:{
    type: String,
    default:""
  },
  username: {
    type: String,
    required: [true, "username area is required"],
    lowercase: true,
    validate: [validator.isAlphanumeric, "Only Alphanumeric characters"],
  },
  email: {
    type: String,
    required: [true, "email area is required"],
    unique: true,
    validate: [validator.isEmail, "Valid email is required"]
  },
  password: {
    type: String,
    required: [true, "password area is required"],
    minLength: [8, 'At least 8 character']
  },
  role: {
    type: String,
    enum: ['user', 'admin','reyaset_heyyyeti_uzvleri','heqiqi_uzvler', 'assosiasiyali_uzvler', 'fexri_uzvler', 'komekci_uzvler'], // sadece 'user' veya 'admin' olabilir
    default: 'user' // varsayılan olarak kullanıcı rolü
  },
  url:{
    type:String,
  },
  image_id: {
    type: String,
    default:"",
  },
  fb:{
  type:String,
  default:"https://www.facebook.com/"
  },
  inst:{
    type:String,
    default:"https://www.instagram.com/"
  }
},
  {
    timestamps: true
  }
);


userSchema.pre('save', function (next) {
  const user = this;
  if (user.name) {
    user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  }
  if (user.surname) {
    user.surname = user.surname.charAt(0).toUpperCase() + user.surname.slice(1);
  }
  bcrypt.hash(user.password, 10, (err, hash) => {
    user.password = hash;
    next();
  });
});


const User = mongoose.model('User', userSchema);

export default User;