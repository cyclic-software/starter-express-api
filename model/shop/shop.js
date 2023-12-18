import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image:{
      type: String,
      required: true
  },
  owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// populating category, seller, and shop
shopSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: 'name email',
  })
  next();
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;