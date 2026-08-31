import Cart from '../models/cartModel.js';

// Add Item to Cart / Update Cart
export const addToCart = async (req, res) => {
    const { userId, productId, name, price, quantity, image } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        const itemIndex = cart.items.findIndex(p => p.productId === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ productId, name, price, quantity: quantity || 1, image });
        }

        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User Cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(200).json({ success: true, items: [], totalPrice: 0 });
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};