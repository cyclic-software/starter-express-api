import mongoose from 'mongoose';
import validator from 'validator';

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // address: {
    //   type: String,
    //   required: true,
    // },
    number: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, 'provide a valid email address'],
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Contact = mongoose.model('Messages', ContactSchema);

export default Contact;
