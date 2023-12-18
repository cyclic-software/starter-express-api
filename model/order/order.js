import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'cancelled', 'shipped', 'delivered'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cartId',
    select: 'identityNumber totalPrice products user active'
  })
  .populate({
    path: 'cartId.products.productId',
    model: 'Product',
    select: 'name image price inStock category' // list all field names of the Product schema here
  });
  next();
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;