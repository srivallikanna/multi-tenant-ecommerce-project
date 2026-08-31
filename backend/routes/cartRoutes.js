import express from 'express';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// Add item to Cart
router.post('/add', async (req, res) => {
  try {
    const { productId, userId } = req.body;
    
    // Check product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = new Cart({
        userId,
        items: [{ 
          productId: product._id, 
          name: product.name, 
          price: Number(product.price) || 0, 
          quantity: 1 
        }],
        totalPrice: Number(product.price) || 0
      });
    } else {
      // If cart exists, add or update item
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ 
          productId: product._id, 
          name: product.name, 
          price: Number(product.price) || 0, 
          quantity: 1 
        });
      }

      cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    await cart.save();
    res.status(200).json({ message: 'Product Added to Cart Successfully!', cart });
  } catch (error) {
    console.error("Cart Error:", error);
    res.status(500).json({ message: error.message || 'Server error while adding to cart' });
  }
});

// Get Cart Items
router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.status(200).json(cart || { items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 