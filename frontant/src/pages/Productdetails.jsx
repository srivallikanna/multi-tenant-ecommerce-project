import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

// Helper function to map store slug
function getStoreSlug(vendorName = "") {
  const v = (vendorName || "").toLowerCase();
  if (v.includes("srivalli")) return "srivalli-store";
  if (v.includes("riya")) return "riya-store";
  if (v.includes("anuj")) return "anuj-store";
  return "gaurav-store";
}

// Helper function to normalize vendor name
function getNormalizedVendor(vendorName = "") {
  const v = (vendorName || "").toLowerCase();
  if (v.includes("srivalli") || v.includes("chrono") || v.includes("watch")) return "Srivalli's Store";
  if (v.includes("riya") || v.includes("beauty") || v.includes("velvet") || v.includes("serum")) return "Riya's Store";
  if (v.includes("anuj") || v.includes("urban") || v.includes("apex") || v.includes("denim") || v.includes("shoe") || v.includes("apparel")) return "Anuj's Store";
  return "Gaurav's Store";
}

// Generate rich product specs & narrative
function getComprehensiveProductDetails(product) {
  if (!product) return null;

  const name = (product.name || "").toLowerCase();
  const rawDesc = product.description || "";
  const vendor = getNormalizedVendor(product.vendorName);

  if (name.includes("headphone") || name.includes("audio") || name.includes("earbud") || name.includes("speaker")) {
    return {
      vendor,
      headline: "Audiophile-Grade Acoustic Engineering with Hybrid Active Noise Cancellation",
      detailedNarrative: [
        `${rawDesc} Handcrafted with precision 40mm custom titanium diaphragm drivers, delivering rich sub-bass depth, crystal-clear mids, and sparkling highs.`,
        `Advanced hybrid active noise cancellation continuously samples ambient frequency, attenuating up to 35dB of low-frequency engine rumbles and chatter.`,
        `Plush memory foam ear cushions enveloped in ultra-soft protein leather provide featherlight listening for up to 30 hours.`
      ],
      highlights: [
        { icon: "🎧", title: "Custom Titanium Drivers", desc: "Hi-Res Audio certified acoustic performance." },
        { icon: "🔇", title: "Hybrid Active Noise Cancellation", desc: "Eliminates up to 35dB of ambient noise." },
        { icon: "🔋", title: "30-Hour Ultra-Long Battery", desc: "Continuous ANC playback with USB-C fast charge." },
        { icon: "🎙️", title: "AI Clear Voice Calls", desc: "4-mic beamforming array filters out wind noise." }
      ],
      specs: [
        { label: "Driver Size", value: "40mm Custom High-Res Titanium Diaphragms" },
        { label: "Frequency Response", value: "20Hz - 40,000Hz (Hi-Res Audio)" },
        { label: "Connectivity", value: "Bluetooth 5.3 + 3.5mm Aux" },
        { label: "Battery Life", value: "30 Hours (ANC ON) / 45 Hours (ANC OFF)" },
        { label: "Warranty", value: "2-Year Manufacturer Acoustic Warranty" }
      ],
      boxContents: [
        "1x Premium Wireless ANC Headphones",
        "1x Hard-Shell Travel Carrying Case",
        "1x 1.2m Braided 3.5mm Audio Cable",
        "1x USB-C Fast-Charging Cable",
        "1x User Manual & Warranty Card"
      ]
    };
  }

  if (name.includes("watch") || name.includes("chrono") || name.includes("leather")) {
    return {
      vendor,
      headline: "Artisanal Craftsmanship & Precision Horological Engineering",
      detailedNarrative: [
        `${rawDesc} Crafted from hypoallergenic 316L surgical stainless steel with a high-polished bezel and scratch-resistant sapphire crystal lens.`,
        `Driven by an ultra-precise Japanese quartz movement with chronograph sub-dials and date window.`,
        `Paired with a genuine full-grain Italian leather strap with hand-waxed perimeter stitching.`
      ],
      highlights: [
        { icon: "⏱️", title: "Japanese Quartz Chrono", desc: "Precision multi-function movement." },
        { icon: "💎", title: "Sapphire Crystal Lens", desc: "Ultra-hard scratch-proof optical glass." },
        { icon: "🛡️", title: "316L Surgical Steel Case", desc: "Corrosion-resistant hypoallergenic casing." },
        { icon: "🌊", title: "5 ATM Water Resistance", desc: "50m splash and recreational swimming proof." }
      ],
      specs: [
        { label: "Case Diameter", value: "41 mm • Thickness: 10.5 mm" },
        { label: "Case Material", value: "316L Surgical Stainless Steel" },
        { label: "Glass", value: "Anti-Scratch Sapphire Crystal" },
        { label: "Strap", value: "20mm Genuine Italian Leather" },
        { label: "Warranty", value: "3-Year International Guarantee" }
      ],
      boxContents: [
        "1x Minimalist Chronograph Luxury Watch",
        "1x Presentation Gift Box",
        "1x Microfiber Polishing Cloth",
        "1x Certificate of Authenticity & 3-Year Warranty"
      ]
    };
  }

  if (name.includes("serum") || name.includes("beauty") || name.includes("skincare") || name.includes("cream")) {
    return {
      vendor,
      headline: "Pure Botanical Glow Formulation with High-Potency Antioxidants",
      detailedNarrative: [
        `${rawDesc} Formulated with 15% pure pharmaceutical-grade L-Ascorbic Acid (Vitamin C) paired with botanical hyaluronic acid.`,
        `Fights oxidative photo-damage, fades dark spots, and deeply hydrates the dermis for radiant elasticity.`,
        `100% vegan, cruelty-free, fragrance-free, and packaged in UV-protective amber glass.`
      ],
      highlights: [
        { icon: "✨", title: "15% Pure Vitamin C", desc: "Potent antioxidant for skin brightening." },
        { icon: "💧", title: "Botanical Hyaluronic Acid", desc: "Deep multi-layer dermis hydration." },
        { icon: "🌿", title: "100% Vegan & Cruelty-Free", desc: "Clean, paraben-free, sulfate-free." },
        { icon: "🛡️", title: "Dermatologist Tested", desc: "Safe for sensitive and acne-prone skin." }
      ],
      specs: [
        { label: "Volume", value: "30 ml / 1.0 fl oz" },
        { label: "Formula Type", value: "Fast-Absorbing Botanical Serum" },
        { label: "Skin Type", value: "All Skin Types (Tested on Sensitive Skin)" },
        { label: "Packaging", value: "UV-Shield Amber Dropper Bottle" },
        { label: "Warranty", value: "100% Authenticity Guarantee" }
      ],
      boxContents: [
        "1x 30ml Vitamin C Radiance Serum",
        "1x Precision Glass Dropper Applicator",
        "1x Skincare Usage Routine Guide"
      ]
    };
  }

  // Default apparel / sneakers / tech
  return {
    vendor,
    headline: "Engineered for Peak Performance, Comfort and Long-Lasting Durability",
    detailedNarrative: [
      `${rawDesc} Precision-engineered with high-performance commercial-grade materials designed for all-day comfort.`,
      `Undergoes stringent multi-stage quality control to ensure maximum resilience and lasting reliability.`,
      `Backed by the official verified merchant guarantee with full buyer protection.`
    ],
    highlights: [
      { icon: "⚡", title: "Premium Build Materials", desc: "Engineered for durability and wear resistance." },
      { icon: "🛡️", title: "Factory Certified", desc: "100% authentic brand new sealed product." },
      { icon: "🚚", title: "Priority Express Shipping", desc: "Dispatched in reinforced protective packaging." },
      { icon: "🔄", title: "7-Day Replacement", desc: "Hassle-free verified returns guarantee." }
    ],
    specs: [
      { label: "Product Condition", value: "Brand New in Factory Sealed Retail Box" },
      { label: "Certification", value: "Verified Merchant Authenticity Inspected" },
      { label: "Quality Grade", value: "Grade-A Premium Commercial Material" },
      { label: "Warranty", value: "1-Year Official Manufacturer Guarantee" }
    ],
    boxContents: [
      `1x ${product.name}`,
      "1x Factory Sealed Retail Packaging",
      "1x User Guide & Warranty Document"
    ]
  };
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedCoupon, setCopiedCoupon] = useState("");
  const [pincode, setPincode] = useState("560001");
  const [pincodeStatus, setPincodeStatus] = useState("Delivery by Tomorrow, 5 PM | Free Delivery");
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        if (res.data) {
          setProduct(res.data);
        }
      } catch (err) {
        console.warn("Backend product fetch fallback:", err.message);
        // Fallback search in fallback items
        setProduct({
          _id: id || "prod_101",
          name: "AcousticPro Studio Wireless ANC Headphones",
          category: "Electronics",
          price: 199.99,
          originalPrice: 349.99,
          rating: 4.9,
          reviewsCount: 142,
          stock: 18,
          vendorName: "Gaurav's Store",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
          description: "Flagship 40mm titanium drivers with active hybrid noise cancellation and 30-hour battery life.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setToastMessage(`Added ${quantity}x "${product.name}" to Cart! 🛒`);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleCopyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setToastMessage(`Coupon code "${code}" copied to clipboard! ✂️`);
    setTimeout(() => {
      setCopiedCoupon("");
      setToastMessage("");
    }, 3000);
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length < 5) {
      setPincodeStatus("Please enter a valid 6-digit Pincode");
      return;
    }
    setPincodeStatus(`✓ Delivery by Tomorrow, 5 PM to ${pincode} | Free Delivery`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 flex-1 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">Loading Product Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 flex-1 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <Link to="/" className="px-4 py-2 bg-[#2874f0] text-white text-xs font-bold rounded-lg inline-block">
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const details = getComprehensiveProductDetails(product);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 35;
  const storeSlug = getStoreSlug(product.vendorName);
  const mainImg = getProductImage(product);

  const galleryImages = [
    mainImg,
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80"
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f6] text-slate-800 flex flex-col font-sans selection:bg-[#2874f0] selection:text-white pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slide-down">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-xs font-bold">{toastMessage}</span>
          <Link to="/cart" className="text-xs font-black text-[#ffe500] hover:underline ml-2">
            View Cart →
          </Link>
        </div>
      )}

      <Navbar />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 flex-1 w-full space-y-4">
        
        {/* Breadcrumb Strip */}
        <div className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto scrollbar-none py-1">
          <Link to="/" className="hover:text-[#2874f0] font-medium">Home</Link>
          <span>›</span>
          <Link to={`/store/${storeSlug}`} className="hover:text-[#2874f0] font-medium">{product.vendorName || "Store"}</Link>
          <span>›</span>
          <span className="text-slate-400 font-medium">{product.category || "General"}</span>
          <span>›</span>
          <span className="text-slate-800 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* ================= FLIPKART 2-COLUMN PRODUCT CONTAINER ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT COLUMN: STICKY GALLERY & ACTION BUTTONS (5 COLS) ================= */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="sticky top-24 space-y-4">
              
              {/* Main Image Frame */}
              <div className="relative aspect-square bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-4 group">
                <img
                  src={galleryImages[selectedImageIdx] || mainImg}
                  alt={product.name}
                  onError={(e) => handleImageError(e, product.name)}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-[#2874f0] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                  ⚡ Assured Quality
                </span>
              </div>

              {/* Image Thumbnails */}
              <div className="flex items-center gap-2.5 justify-center">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 p-1 cursor-pointer transition ${
                      selectedImageIdx === idx ? "border-[#2874f0] ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>

              {/* Side-by-Side Flipkart Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 bg-[#ff9f00] hover:bg-[#f59400] text-slate-950 text-xs sm:text-sm font-black rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🛒</span>
                  <span>ADD TO CART</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 bg-[#fb641b] hover:bg-[#eb5a14] text-white text-xs sm:text-sm font-black rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡</span>
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Trust Badges under buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-500 font-bold text-center">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-sm mb-0.5">🛡️</span>
                  <span>100% Genuine</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-sm mb-0.5">🔄</span>
                  <span>7-Day Return</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-sm mb-0.5">🚚</span>
                  <span>Free Shipping</span>
                </div>
              </div>

            </div>
          </div>

          {/* ================= RIGHT COLUMN: PRODUCT DETAILS & OFFERS (7 COLS) ================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Link
                  to={`/store/${storeSlug}`}
                  className="text-xs font-bold text-[#2874f0] hover:underline"
                >
                  Visit {product.vendorName || "Store"}
                </Link>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Model: MP-{id?.slice(-4) || "2026"}</span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating & Review Summary Badge */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-[#388e3c] text-white px-2.5 py-0.5 rounded-md font-black shadow-xs">
                <span>{product.rating || "4.8"}</span>
                <span>★</span>
              </div>
              <span className="text-slate-500 font-bold">
                {product.reviewsCount || "142"} Ratings & 35 Reviews
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#2874f0] font-black bg-blue-50 px-2 py-0.5 rounded">
                ⚡ Assured
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Special Marketplace Price
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    ${Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-black text-[#388e3c] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {discountPercent}% off
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                + Earn <span className="font-bold text-[#2874f0]">25 MultiTenant SuperCoins</span> on this purchase
              </div>
            </div>

            {/* Available Bank Offers & Coupons Accordion */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Available Offers & Bank Discounts:
              </h3>
              
              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-700 font-black">🏷️</span>
                    <div>
                      <span className="font-bold text-slate-900">Bank Offer:</span> 5% Cashback on MultiTenant Axis Card
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCoupon("AXIS5")}
                    className="text-[10px] font-bold text-[#2874f0] bg-white border border-[#2874f0]/40 px-2 py-0.5 rounded hover:bg-blue-50 cursor-pointer"
                  >
                    {copiedCoupon === "AXIS5" ? "Copied!" : "Copy: AXIS5"}
                  </button>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#2874f0] font-black">🏷️</span>
                    <div>
                      <span className="font-bold text-slate-900">Special Promo:</span> Extra $20 off on orders above $150
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCoupon("SAVE20")}
                    className="text-[10px] font-bold text-[#2874f0] bg-white border border-[#2874f0]/40 px-2 py-0.5 rounded hover:bg-blue-50 cursor-pointer"
                  >
                    {copiedCoupon === "SAVE20" ? "Copied!" : "Copy: SAVE20"}
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Pincode Checker */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Delivery & Service Options</span>
                <span className="text-emerald-600">✓ In Stock ({product.stock || 24} units)</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Delivery Pincode"
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0] flex-1 max-w-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2874f0] hover:bg-[#1e60db] text-white text-xs font-bold rounded-lg cursor-pointer transition"
                >
                  Check
                </button>
              </form>

              <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                <span>🚚</span>
                <span>{pincodeStatus}</span>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Product Highlights:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {details.highlights.map((h, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                    <span className="text-base">{h.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight">{h.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2874f0] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  🏬
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>Seller: {product.vendorName || "Verified Merchant"}</span>
                    <span className="bg-[#388e3c] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                      4.9 ★
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    7-Day Replacement Policy • GST Verified Merchant
                  </div>
                </div>
              </div>

              <Link
                to={`/store/${storeSlug}`}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:border-[#2874f0] text-[#2874f0] text-xs font-bold rounded-lg transition"
              >
                Storefront →
              </Link>
            </div>

            {/* Product Specifications Table */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                Specifications:
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                {details.specs.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-2.5">
                    <span className="text-slate-400 font-semibold">{s.label}</span>
                    <span className="col-span-2 text-slate-800 font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="pt-4">
          <CustomerReviewsSection
            targetId={product._id}
            targetTitle={product.name}
          />
        </section>

      </main>
    </div>
  );
}