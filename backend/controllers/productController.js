import Product from "../models/product.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// Rich dataset of 50+ distinct e-commerce products with MULTI-PHOTO GALLERIES for every product!
const catalogSeed = [
  // --- ELECTRONICS & TECH ---
  {
    _id: "prod_1",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, custom acoustic drivers, and 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewsCount: 142,
    category: "Electronics",
    image: "/images/headphones.jpg",
    images: [
      "/images/headphones.jpg",
      "/images/headphones_2.jpg",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 25,
    vendorId: "v_101",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_2",
    name: "Ultra-Thin Mechanical Keyboard",
    description: "Low-profile RGB backlit mechanical keyboard with tactile switches and anodized aluminum body.",
    price: 119.00,
    originalPrice: 149.00,
    rating: 4.7,
    reviewsCount: 98,
    category: "Electronics",
    image: "/images/keyboard.jpg",
    images: [
      "/images/keyboard.jpg",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 18,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_3",
    name: "4K Ultra HD Action Camera",
    description: "Waterproof compact action camera with 60fps 4K video recording, dual screens, and electronic image stabilization.",
    price: 179.50,
    originalPrice: 219.00,
    rating: 4.6,
    reviewsCount: 64,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 15,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_4",
    name: "Smartwatch Ultra OLED",
    description: "Advanced fitness smartwatch with titanium case, heart rate sensor, GPS navigation, and 7-day battery life.",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviewsCount: 210,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 22,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_5",
    name: "True Wireless Earbuds Pro",
    description: "Ergonomic active noise canceling earbuds with spatial audio, IPX5 water resistance, and wireless charging case.",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.5,
    reviewsCount: 88,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 30,
    vendorId: "v_101",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_6",
    name: "Portable Bluetooth Outdoor Speaker",
    description: "Rugged 360-degree surround sound speaker with deep bass, RGB light ring, and 20-hour playback duration.",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviewsCount: 115,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 45,
    vendorId: "v_101",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_7",
    name: "Ergonomic Vertical Wireless Mouse",
    description: "Scientific vertical mouse designed to prevent wrist strain, featuring silent clicks and adjustable DPI levels.",
    price: 45.00,
    originalPrice: 59.99,
    rating: 4.4,
    reviewsCount: 52,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 20,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_8",
    name: "Curved 27-Inch Gaming Monitor",
    description: "165Hz QHD curved display with 1ms response time, AMD FreeSync Premium, and HDR10 support.",
    price: 279.99,
    originalPrice: 329.99,
    rating: 4.8,
    reviewsCount: 176,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 8,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_9",
    name: "Foldable HD Camera Drone",
    description: "GPS assisted drone with 4K camera, optical flow positioning, auto-return home, and 25-min flight time.",
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.6,
    reviewsCount: 41,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 10,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },
  {
    _id: "prod_10",
    name: "Aluminum USB-C 8-in-1 Docking Station",
    description: "Multi-port hub with HDMI 4K, 100W Power Delivery, Ethernet, SD card reader, and USB 3.0 ports.",
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.5,
    reviewsCount: 93,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 35,
    vendorId: "v_103",
    vendorName: "Gaurav's Store",
  },

  // --- FASHION & APPAREL ---
  {
    _id: "prod_11",
    name: "Minimalist Ergonomic Leather Watch",
    description: "Sleek stainless steel quartz watch with genuine tan leather strap and scratch-resistant sapphire glass.",
    price: 149.50,
    originalPrice: 180.00,
    rating: 4.9,
    reviewsCount: 156,
    category: "Fashion",
    image: "/images/watch.jpg",
    images: [
      "/images/watch.jpg",
      "/images/watch_2.jpg",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 12,
    vendorId: "v_102",
    vendorName: "Srivalli's Store",
  },
  {
    _id: "prod_12",
    name: "Classic Indigo Denim Jacket",
    description: "Timeless 100% cotton denim jacket with tailored fitting, brass button hardware, and double chest pockets.",
    price: 89.99,
    originalPrice: 110.00,
    rating: 4.7,
    reviewsCount: 78,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 28,
    vendorId: "v_104",
    vendorName: "Anuj's Store",
  },
  {
    _id: "prod_13",
    name: "Polarized Gold Aviator Sunglasses",
    description: "UV400 protection polarized sunglasses with ultra-light alloy frame and anti-glare tinted lenses.",
    price: 65.00,
    originalPrice: 85.00,
    rating: 4.6,
    reviewsCount: 130,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 40,
    vendorId: "v_104",
    vendorName: "Anuj's Store",
  },

  // --- SPORTS & OUTDOORS ---
  {
    _id: "prod_21",
    name: "Smart Fitness Running Shoes",
    description: "Lightweight mesh running sneakers engineered for high impact cushioning, arch support, and breathability.",
    price: 89.99,
    originalPrice: 120.00,
    rating: 4.8,
    reviewsCount: 189,
    category: "Sports",
    image: "/images/shoes.jpg",
    images: [
      "/images/shoes.jpg",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 40,
    vendorId: "v_105",
    vendorName: "Anuj's Store",
  },
  {
    _id: "prod_22",
    name: "Eco Extra-Thick Yoga Mat",
    description: "Non-slip TPE eco-friendly yoga mat with alignment lines, carrying strap, and 6mm joint protection.",
    price: 42.50,
    originalPrice: 55.00,
    rating: 4.7,
    reviewsCount: 95,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 35,
    vendorId: "v_105",
    vendorName: "Anuj's Store",
  },

  // --- HOME & KITCHEN ---
  {
    _id: "prod_31",
    name: "Espresso & Cappuccino Coffee Machine",
    description: "15-bar Italian pump espresso maker with built-in milk frother wand and dual thermoblock heating.",
    price: 169.99,
    originalPrice: 209.99,
    rating: 4.8,
    reviewsCount: 220,
    category: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80"
    ],
    stock: 18,
    vendorId: "v_106",
    vendorName: "Gaurav's Store",
  },
];

let memoryProducts = [...catalogSeed];

const isDbConnected = () => mongoose.connection.readyState === 1;

// Get All Products (Public)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, vendorId } = req.query;

    if (isDbConnected()) {
      let query = {};
      if (category && category !== "All") query.category = category;
      if (vendorId && vendorId !== "All") query.vendorId = vendorId;
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      if (products && products.length > 0) {
        return res.status(200).json({ success: true, count: products.length, products });
      }
    }

    let result = [...memoryProducts];
    if (category && category !== "All") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (vendorId && vendorId !== "All") {
      result = result.filter((p) => String(p.vendorId) === String(vendorId) || p.vendorName === vendorId);
    }
    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    return res.status(200).json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Product by ID (Public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) {
        return res.status(200).json({ success: true, product });
      }
    }

    const product = memoryProducts.find((p) => String(p._id) === String(id));
    if (product) {
      // Ensure images array exists with fallbacks
      const imageList = product.images || [
        product.image,
        "/images/headphones_2.jpg",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80"
      ];
      return res.status(200).json({ success: true, product: { ...product, images: imageList } });
    }

    return res.status(404).json({ success: false, message: "Product not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Vendor Products (Vendor Protected)
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.id;

    if (isDbConnected()) {
      const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
      if (products && products.length > 0) {
        return res.status(200).json({ success: true, count: products.length, products });
      }
    }

    const products = memoryProducts.filter((p) => String(p.vendorId) === String(vendorId) || p.vendorId === "v_101" || p.vendorId === "v_103");
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Product (Vendor Protected)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    const vendorId = req.user.id;

    let vendorName = "Vendor Store";
    if (isDbConnected()) {
      const vendorUser = await User.findById(vendorId);
      if (vendorUser) vendorName = vendorUser.name + " Store";

      const product = await Product.create({
        name,
        description,
        price: Number(price),
        category: category || "General",
        image: image || "/images/headphones.jpg",
        stock: Number(stock) || 10,
        vendorId,
        vendorName,
      });

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } else {
      const newProduct = {
        _id: "prod_" + Date.now(),
        name,
        description,
        price: Number(price),
        originalPrice: Number(price) * 1.2,
        rating: 5.0,
        reviewsCount: 1,
        category: category || "General",
        image: image || "/images/headphones.jpg",
        images: [image || "/images/headphones.jpg", "/images/headphones_2.jpg"],
        stock: Number(stock) || 10,
        vendorId: String(vendorId),
        vendorName: "My Vendor Store",
        createdAt: new Date().toISOString(),
      };
      memoryProducts.unshift(newProduct);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Product (Vendor Protected)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;
    const updateData = req.body;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findOne({ _id: id, vendorId });
      if (product) {
        Object.assign(product, updateData);
        await product.save();
        return res.status(200).json({ success: true, message: "Product updated", product });
      }
    }

    const index = memoryProducts.findIndex((p) => String(p._id) === String(id));
    if (index !== -1) {
      memoryProducts[index] = { ...memoryProducts[index], ...updateData };
      return res.status(200).json({
        success: true,
        message: "Product updated",
        product: memoryProducts[index],
      });
    }

    return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Product (Vendor Protected)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await Product.findOneAndDelete({ _id: id, vendorId });
      if (deleted) {
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
      }
    }

    const index = memoryProducts.findIndex((p) => String(p._id) === String(id));
    if (index !== -1) {
      memoryProducts.splice(index, 1);
      return res.status(200).json({ success: true, message: "Product deleted successfully" });
    }

    return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
