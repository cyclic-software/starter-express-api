import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      required: true,
    },
    size:[
      {
        type: String,
      },
    ],
    image: {
      type: [String],
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    specification: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: 'Shop',
      required: true,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.path('inStock').validate({
  validator: function(value) {
    return this.inStock >= value;
  },
  message: 'Product quantity exceeds available stock. Please adjust.',
});

// populating category, seller, and shop
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name',
  }).populate({
    path: 'seller',
    select: 'name',
  }).populate({
    path: 'shop',
    select: 'name',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
