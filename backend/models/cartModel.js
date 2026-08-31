import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  items: [
    {
      productId: { type: String, required: false },
      name: { type: String, required: false },
      price: { type: Number, required: false, default: 0 },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, required: false, default: 0 }
}, { strict: false });

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);