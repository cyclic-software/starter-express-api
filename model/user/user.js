import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validator.isEmail, 'provide a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    resetPasswordToken: String,
    address: {
      type: String,
    },
    number: {
      type: Number,
    },
    acctType: {
      type: String,
      enum: ['Admin', 'Buyer', 'Seller', 'DeliveryCrew'],
      default: 'Buyer',
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    profile: {
      type: String,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const User = mongoose.model('User', userSchema);

export default User;
