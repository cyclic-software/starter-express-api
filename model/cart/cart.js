import mongoose from 'mongoose';
import { generate } from 'randomstring';

const cartSchema = new mongoose.Schema(
  {
    identityNumber: {
      type: String,
      required: true,
      select: false,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        subPrice: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shipping_fee: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

cartSchema.pre('save', function (next) {
  this.products.forEach((item) => {
    item.subPrice = item.price * item.quantity;
  });
  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products',
    select: 'name, image, price, inStock, category',
  });
  this.populate('user');
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;