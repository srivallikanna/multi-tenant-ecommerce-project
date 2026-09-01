import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    address: {
      fullName: String,
      mobile: String,
      address: String,
      city: String,
      state: String,
      pincode: String
    },

    status: {
      type: String,
      default: 'Placed'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Order ||
  mongoose.model('Order', orderSchema);