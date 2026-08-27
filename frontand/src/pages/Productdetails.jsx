import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import CustomerReviewsSection from "../components/CustomerReviewsSection";
import { useCart } from "../context/CartContext";
import { getProductImage, handleImageError } from "../utils/imageUtils";
import api from "../api/axios";

// Helper function to map store slug
function getStoreSlug(vendorName = "") {
  const v = vendorName.toLowerCase();
  if (v.includes("srivalli")) return "srivalli-store";
  if (v.includes("riya")) return "riya-store";
  if (v.includes("anuj")) return "anuj-store";
  return "gaurav-store";
}

// Helper function to normalize vendor name to the 4 approved names
function getNormalizedVendor(vendorName = "") {
  const v = vendorName.toLowerCase();
  if (v.includes("srivalli") || v.includes("chrono") || v.includes("watch")) return "Srivalli's Store";
  if (v.includes("riya") || v.includes("beauty") || v.includes("velvet") || v.includes("serum")) return "Riya's Store";
  if (v.includes("anuj") || v.includes("urban") || v.includes("apex") || v.includes("denim") || v.includes("shoe") || v.includes("apparel")) return "Anuj's Store";
  return "Gaurav's Store";
}

// Generate rich, comprehensive, and realistic product descriptions, specifications, and box contents
function getComprehensiveProductDetails(product) {
  if (!product) return null;

  const name = (product.name || "").toLowerCase();
  const category = (product.category || "").toLowerCase();
  const rawDesc = product.description || "";
  const vendor = getNormalizedVendor(product.vendorName);

  // MOUSE & PERIPHERALS
  if (name.includes("mouse") || name.includes("trackpad")) {
    return {
      vendor,
      headline: "Scientifically Sculpted for All-Day Comfort & Precision Control",
      detailedNarrative: [
        `${rawDesc} Engineered in collaboration with ergonomic specialists, the natural 57° handshake angle aligns your wrist and forearm into an optimal neutral posture, reducing muscular strain and fatigue during prolonged computer sessions.`,
        `Equipped with an advanced high-precision optical sensor offering instant DPI switching between 800, 1200, 1600, 2400, and 4000 DPI. Whether navigating complex spreadsheets, retouching high-resolution graphics, or multitasking across multiple monitors, the cursor glide is exceptionally smooth, fluid, and responsive.`,
        `Features whisper-quiet silent switches rated for over 10 million clicks, eliminating distracting click noise while preserving crisp tactile feedback. The integrated high-capacity rechargeable battery delivers up to 90 days of continuous daily workflow on a single 2-hour USB-C charge.`
      ],
      highlights: [
        { icon: "🖐️", title: "57° Ergonomic Handshake Grip", desc: "Reduces wrist pressure by up to 40% compared to traditional flat mice." },
        { icon: "⚡", title: "4000 DPI Precision Optical Sensor", desc: "Instant 5-level DPI sensitivity toggle for micro-precision or rapid tracking." },
        { icon: "🤫", title: "90% Silent Tactile Switches", desc: "Soft-damped click mechanisms provide satisfying feedback without ambient noise." },
        { icon: "🔋", title: "Fast USB-C Rechargeable", desc: "Up to 90 days battery life with quick-charge capabilities (3 mins charge = 1 full day)." },
        { icon: "📶", title: "Dual Wireless Modes", desc: "Seamlessly connect via 2.4GHz USB Nano Receiver or Bluetooth 5.3 multi-device pairing." }
      ],
      specs: [
        { label: "Sensor Type", value: "High-Precision Optical Engine" },
        { label: "DPI Range", value: "800 / 1200 / 1600 / 2400 / 4000 DPI" },
        { label: "Connectivity", value: "2.4GHz Wireless USB Dongle + Bluetooth 5.3" },
        { label: "Wireless Range", value: "Up to 10 meters (33 feet) with zero latency" },
        { label: "Battery Capacity", value: "500mAh Lithium-Polymer (USB-C Rechargeable)" },
        { label: "Button Count", value: "6 Buttons (Left, Right, Scroll, DPI, Forward, Back)" },
        { label: "Dimensions & Weight", value: "120 x 78 x 68 mm • 115 grams" },
        { label: "Compatibility", value: "Windows 11/10, macOS, iPadOS, ChromeOS, Linux" },
        { label: "Warranty", value: "2-Year Official Manufacturer Hardware Warranty" }
      ],
      boxContents: [
        "1x Ergonomic Vertical Wireless Mouse Unit",
        "1x 2.4GHz Ultra-Low Latency USB Nano Receiver",
        "1x 1.2m Braided USB-C Fast-Charging Cable",
        "1x Illustrated User Guide & Quick Setup Manual",
        "1x Manufacturer 2-Year Warranty Card"
      ]
    };
  }

  // HEADPHONES & AUDIO
  if (name.includes("headphone") || name.includes("audio") || name.includes("earbud") || name.includes("speaker")) {
    return {
      vendor,
      headline: "Audiophile-Grade Acoustic Engineering with Hybrid Active Noise Cancellation",
      detailedNarrative: [
        `${rawDesc} Handcrafted with precision 40mm custom titanium diaphragm drivers, delivering rich sub-bass depth, crystal-clear mids, and sparkling highs with near-zero harmonic distortion.`,
        `Advanced hybrid active noise cancellation continuously samples ambient frequency up to 50,000 times per second, effortlessly attenuating up to 35dB of low-frequency engine rumbles, office chatter, and street noise. With one tap, switch into Ambient Transparency Mode to converse or stay alert to surroundings.`,
        `Plush memory foam ear cushions enveloped in ultra-soft protein leather provide featherlight, pressure-free listening for up to 30 hours of continuous wireless playback on a single charge.`
      ],
      highlights: [
        { icon: "🎧", title: "Custom Titanium Drivers", desc: "Hi-Res Audio certified acoustic performance with balanced stereo separation." },
        { icon: "🔇", title: "Hybrid Active Noise Cancellation", desc: "Eliminates up to 35dB of ambient noise with dual-feedforward microphones." },
        { icon: "🔋", title: "30-Hour Ultra-Long Battery", desc: "Continuous ANC playback with USB-C fast charging (10 mins = 5 hours)." },
        { icon: "🎙️", title: "AI Clear Voice Calls", desc: "4-mic beamforming array filters out wind and background noise during calls." },
        { icon: "☁️", title: "Ergonomic CloudFit Cushions", desc: "High-density memory foam earcups for all-day fatigue-free listening." }
      ],
      specs: [
        { label: "Driver Size", value: "40mm Custom High-Res Titanium Diaphragms" },
        { label: "Frequency Response", value: "20Hz - 40,000Hz (Hi-Res Audio Certified)" },
        { label: "Impedance", value: "32 Ohms ± 15%" },
        { label: "Bluetooth Version", value: "Bluetooth 5.3 (AAC, SBC, LDAC support)" },
        { label: "Battery Life", value: "30 Hours (ANC ON) / 45 Hours (ANC OFF)" },
        { label: "Charging Port", value: "USB Type-C Fast Charge (5V / 1A)" },
        { label: "Weight", value: "250 grams lightweight folding design" },
        { label: "Warranty", value: "2-Year Acoustic Manufacturer Warranty" }
      ],
      boxContents: [
        "1x Premium Wireless Noise-Canceling Headphones",
        "1x Protective Hard-Shell Travel Carrying Case",
        "1x 1.2m Braided 3.5mm Gold-Plated Audio Cable",
        "1x USB-C High-Speed Charging Cable",
        "1x Flight Adapter & User Manual"
      ]
    };
  }

  // WATCHES & LUXURY TIMEPIECES
  if (name.includes("watch") || name.includes("chrono") || name.includes("leather")) {
    return {
      vendor,
      headline: "Artisanal Craftsmanship & Precision Horological Engineering",
      detailedNarrative: [
        `${rawDesc} Crafted from hypoallergenic 316L surgical-grade stainless steel with a high-polished bezel and sunray dial accents. The dial is shielded by sapphire crystal glass, rated 9 on the Mohs hardness scale for virtually impenetrable scratch resistance.`,
        `Driven by an ultra-precise Japanese quartz movement renowned for keeping accurate time within ±10 seconds per year. Featuring a 3-dial chronograph timer with 1/10-second sub-dial and date calendar window.`,
        `Paired with a genuine full-grain Italian leather strap with hand-waxed perimeter stitching and quick-release spring bars, allowing effortless strap swaps to match any dress code.`
      ],
      highlights: [
        { icon: "⏱️", title: "Japanese Quartz Chronograph", desc: "Precision multi-function movement with stopwatch and date window." },
        { icon: "💎", title: "Sapphire Crystal Lens", desc: "Ultra-hard scratch-proof crystal with anti-reflective optical coating." },
        { icon: "🛡️", title: "316L Surgical Steel Case", desc: "Corrosion-resistant, hypoallergenic casing with polished chamfered bevels." },
        { icon: "🌊", title: "5 ATM Water Resistance", desc: "Rated for 50 meters (165 feet) splash, shower, and recreational swimming." },
        { icon: "🧵", title: "Full-Grain Italian Leather", desc: "Supple genuine leather that develops a handsome rich patina over time." }
      ],
      specs: [
        { label: "Case Diameter", value: "41 mm • Thickness: 10.5 mm" },
        { label: "Case Material", value: "316L Surgical Stainless Steel" },
        { label: "Glass Lens", value: "Anti-Scratch Sapphire Crystal" },
        { label: "Movement", value: "Japanese Precision Quartz 3-Hand Chrono" },
        { label: "Strap Width & Material", value: "20 mm Genuine Hand-Stitched Italian Leather" },
        { label: "Water Resistance", value: "5 ATM / 50 Meters / 165 Feet" },
        { label: "Battery Life", value: "3-Year Standard Silver Oxide Button Cell" },
        { label: "Warranty", value: "3-Year International Timepiece Guarantee" }
      ],
      boxContents: [
        "1x Minimalist Chronograph Luxury Watch",
        "1x Genuine Leather Presentation Gift Box",
        "1x Microfiber Polishing & Cleaning Cloth",
        "1x Horological Manual & Setting Guide",
        "1x Certificate of Authenticity & 3-Year Guarantee"
      ]
    };
  }

  // KEYBOARDS & TECH GEAR
  if (name.includes("keyboard") || name.includes("camera") || name.includes("dock") || name.includes("monitor") || name.includes("drone")) {
    return {
      vendor,
      headline: "High-Performance Hardware Engineered for Power Users & Creators",
      detailedNarrative: [
        `${rawDesc} Built within a solid CNC-machined anodized aluminum chassis that offers zero flex and industrial durability. Every component has been thoroughly tested for seamless plug-and-play performance.`,
        `Engineered for optimal responsiveness, low latency, and maximum workflow efficiency. Supports cross-platform compatibility across Windows, macOS, Linux, Android, and iOS with dedicated hotkey switching.`,
        `Equipped with smart power management and premium shielding to guarantee thermal regulation and uninterrupted connectivity throughout heavy workloads.`
      ],
      highlights: [
        { icon: "💻", title: "Aircraft-Grade Aluminum Body", desc: "Rigid, lightweight chassis with premium sandblasted matte finish." },
        { icon: "⚡", title: "Ultra-Low Latency Performance", desc: "Instant response times with 1000Hz polling rate architecture." },
        { icon: "🔄", title: "Universal OS Compatibility", desc: "Full plug-and-play support for macOS, Windows, Linux, and mobile." },
        { icon: "🛡️", title: "Factory Quality Certified", desc: "100% inspected and certified for safety, durability, and signal integrity." }
      ],
      specs: [
        { label: "Chassis Material", value: "CNC Anodized Aircraft Aluminum" },
        { label: "Interface / Port", value: "USB Type-C 3.2 Gen 2 + Wireless" },
        { label: "Compatibility", value: "Windows 10/11, macOS, Linux, ChromeOS" },
        { label: "Power Efficiency", value: "Smart Sleep Mode with Instant Wakeup" },
        { label: "Certifications", value: "CE, FCC, RoHS Quality Compliant" },
        { label: "Warranty", value: "2-Year Full Hardware Replacement Guarantee" }
      ],
      boxContents: [
        "1x Hardware Main Unit",
        "1x Heavy-Duty Braided Connection Cable",
        "1x USB Adapter / Receiver",
        "1x Quick Installation & Setup Manual",
        "1x 2-Year Hardware Warranty Certificate"
      ]
    };
  }

  // BEAUTY & SKINCARE
  if (name.includes("serum") || name.includes("skincare") || name.includes("beauty") || name.includes("cream")) {
    return {
      vendor,
      headline: "Clean Botanical Science for Radiant, Healthy, and Rejuvenated Skin",
      detailedNarrative: [
        `${rawDesc} Formulated with clinically validated concentrations of botanical active ingredients that penetrate deep into the skin's dermal layers to boost cellular hydration and collagen synthesis.`,
        `Free of parabens, sulfates, phthalates, synthetic dyes, and artificial fragrances. Suitable for all skin types, including sensitive and acne-prone skin. Non-comedogenic and hypoallergenic.`,
        `Packaged in an amber apothecary glass bottle with UV-blocking technology to maintain formula potency and active ingredient integrity over time.`
      ],
      highlights: [
        { icon: "🌿", title: "100% Vegan & Cruelty-Free", desc: "Ethically formulated without animal testing or harsh chemicals." },
        { icon: "💧", title: "Deep Dermal Hydration", desc: "Dual-molecular weight hyaluronic acid binds moisture for up to 48 hours." },
        { icon: "🔬", title: "Dermatologist Tested", desc: "Clinically proven hypoallergenic and safe for daily morning & night use." },
        { icon: "✨", title: "Collagen & Brightening Boost", desc: "Fades dark spots, evens skin tone, and restores vibrant youthful glow." }
      ],
      specs: [
        { label: "Volume / Size", value: "30 ml / 1.0 fl. oz." },
        { label: "Formulation", value: "Cold-Pressed Liquid Serum" },
        { label: "Skin Compatibility", value: "All Skin Types (Dry, Oily, Sensitive, Combination)" },
        { label: "Usage Instructions", value: "Apply 3-4 drops morning and night on cleansed skin" },
        { label: "Shelf Life", value: "24 Months (12 Months after opening)" },
        { label: "Guarantee", value: "100% Satisfaction Money-Back Guarantee" }
      ],
      boxContents: [
        "1x 30ml Botanical Active Skin Treatment Dropper",
        "1x Skin Ritual & Application Instructions Card",
        "1x Batch Quality Certificate"
      ]
    };
  }

  // FASHION, APPAREL & FOOTWEAR
  return {
    vendor,
    headline: "Premium Materials & Tailored Construction for Everyday Style and Durability",
    detailedNarrative: [
      `${rawDesc} Engineered from premium hand-selected fabrics and reinforced structural components to deliver maximum comfort, breathability, and enduring longevity across all seasons.`,
      `Designed with a contemporary modern silhouette that effortlessly balances casual everyday ease with refined craftsmanship. Every seam is reinforced with high-tensile stitching to prevent fraying or warping over years of wear.`,
      `Pre-shrunk and color-fast treated to maintain rich vibrancy and structural integrity through repeated wash and wear cycles.`
    ],
    highlights: [
      { icon: "🧵", title: "High-Tensile Reinforced Stitching", desc: "Built to resist wear and tear while retaining tailored structure." },
      { icon: "🌬️", title: "Breathable Climate Comfort", desc: "Engineered fabric weave allows optimal airflow and temperature regulation." },
      { icon: "✨", title: "Color-Fast & Pre-Shrunk", desc: "Retains original fit and vibrant color through everyday laundering." },
      { icon: "🏷️", title: "Authentic Store Guarantee", desc: "100% authentic quality certified from verified tenant merchant." }
    ],
    specs: [
      { label: "Material Composition", value: "Premium Grade Textile / Cotton Blend" },
      { label: "Fit Type", value: "Modern Tailored Regular Fit" },
      { label: "Care Instructions", value: "Machine Wash Cold, Tumble Dry Low" },
      { label: "Origin", value: "Ethically Sourced & Crafted" },
      { label: "Guarantee", value: "30-Day Free Exchanges & Returns" }
    ],
    boxContents: [
      "1x Premium Apparel / Footwear Unit",
      "1x Eco-Friendly Protective Garment Packaging",
      "1x Brand Care & Authenticity Card"
    ]
  };
}

export default function Productdetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/detail/${id}`);
      if (res.data && res.data.product) {
        setProduct(res.data.product);
        setActiveImageIndex(0);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setToastMessage(`Added ${quantity} x "${product.name}" to cart!`);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  const details = getComprehensiveProductDetails(product);

  const galleryImages = product?.images && product.images.length > 0
    ? product.images
    : [
        getProductImage(product),
        "/images/headphones_2.jpg",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80"
      ];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];
  const discountPercent = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold border border-slate-700 flex items-center gap-2 animate-slide-up">
          <span className="text-emerald-400">✓</span> {toastMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition">Marketplace Catalog</Link>
          <span>/</span>
          <span className="text-slate-400">{product?.category || "Category"}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate max-w-xs">{product?.name || "Product"}</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-xs font-semibold">Loading verified product details...</p>
          </div>
        ) : error || !product ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-slate-800">{error || "Product Not Found"}</h2>
            <p className="text-xs text-slate-500">The product you requested might have been moved or updated.</p>
            <Link to="/" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* ================= TOP SECTION: PRODUCT HERO CARD ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {/* Left Column: Multi-Image Gallery (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex items-center justify-center group shadow-xs">
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, product.category, product.name)}
                  />

                  {discountPercent > 0 && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-sm">
                      -{discountPercent}% OFF
                    </span>
                  )}

                  <Link
                    to={`/store/${getStoreSlug(details.vendor)}`}
                    className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-indigo-700 hover:text-indigo-900 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-100 shadow-md transition flex items-center gap-1.5"
                  >
                    <span>🏪</span>
                    <span>{details.vendor}</span>
                    <span className="text-emerald-600 text-[10px]">✓</span>
                  </Link>
                </div>

                {/* Thumbnails row */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-100 ${
                        activeImageIndex === idx
                          ? "border-indigo-600 ring-2 ring-indigo-200 scale-102"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, product.category, product.name)}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle & Right: Product Info & Purchase Actions (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div>
                  {/* Category & Stock Tag */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                      {product.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {product.stock > 0 ? `In Stock (${product.stock} units left)` : "Out of Stock"}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    {product.name}
                  </h1>

                  {/* Rating & Reviews counter */}
                  <div className="flex items-center gap-3 mb-4 text-xs">
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-lg font-bold">
                      <span>★</span>
                      <span>{product.rating || "4.8"}</span>
                    </div>
                    <span className="text-slate-500 font-medium">
                      ({product.reviewsCount || "142"} verified customer reviews)
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">✓ 100% Genuine Certified</span>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through font-semibold">
                        ${Number(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                    {discountPercent > 0 && (
                      <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Save ${(product.originalPrice - product.price).toFixed(2)} ({discountPercent}% OFF)
                      </span>
                    )}
                  </div>

                  {/* Summary Headline */}
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    Key Overview:
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {details.headline}. {product.description}
                  </p>

                  {/* Fast Highlights Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {details.highlights.slice(0, 4).map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-2.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                        <span className="text-base">{h.icon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-tight">{h.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purchase Controls & Trust Badges */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Quantity:</span>
                      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-200 font-bold transition"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 text-xs font-black text-slate-900 bg-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                          className="px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-200 font-bold transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Subtotal for Selection */}
                    <div className="text-right sm:block hidden">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Item Total:</span>
                      <span className="text-lg font-black text-slate-900">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart & Buy Now CTA buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                      className="py-3.5 px-6 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 text-xs font-black rounded-full shadow-md border border-[#fcd200] transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>🛒</span> Add to Cart • ${(product.price * quantity).toFixed(2)}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock <= 0}
                      className="py-3.5 px-6 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-950 text-xs font-black rounded-full shadow-md border border-[#ff8f00] transition active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>⚡</span> Buy Now with 1-Click
                    </button>
                  </div>

                  {/* Delivery & Protection Bulletins */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-emerald-600 font-bold">🚚</span>
                      <span>Fast Tracked Shipping</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-indigo-600 font-bold">🔄</span>
                      <span>30-Day Free Returns</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-amber-600 font-bold">🛡️</span>
                      <span>2-Year Full Warranty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= MIDDLE SECTION 1: IN-DEPTH DESCRIPTION & KEY FEATURES ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Deep Dive Description & Highlights */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                      Comprehensive Product Description
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Designed and manufactured for high reliability, premium ergonomics, and lasting performance.
                    </p>
                  </div>

                  {/* Long-form narrative paragraphs */}
                  <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {details.detailedNarrative.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Detailed Feature Cards */}
                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <h3 className="text-sm font-black text-slate-900">
                      Signature Engineering Highlights:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {details.highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <h4 className="text-xs font-extrabold text-slate-900">{item.title}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                      Technical Specifications & Parameters
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Factory specifications verified by certified quality assurance inspection.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {details.specs.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/70"
                      >
                        <span className="font-bold text-slate-500">{s.label}:</span>
                        <span className="font-extrabold text-slate-900 text-right ml-2">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Package Contents & Store Profile Card */}
              <div className="space-y-6">
                {/* What's In The Box */}
                <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span>📦</span> What's In The Box
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    {details.boxContents.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                        <span className="font-semibold leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                    All packaging is 100% eco-friendly and fully recyclable.
                  </div>
                </div>

                {/* Verified Store Profile Card */}
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-indigo-800 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-full uppercase tracking-wider border border-emerald-400/30">
                      ✓ Verified Merchant
                    </span>
                    <span className="text-xs text-indigo-300 font-bold">Top Seller</span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">{details.vendor}</h3>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      Authorized retailer on MultiTenant E-Commerce Platform.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 text-xs">
                    <div>
                      <span className="text-[10px] text-indigo-200 uppercase font-bold block">Rating</span>
                      <span className="font-black text-white text-sm">4.9 / 5.0 ★</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-200 uppercase font-bold block">Response Time</span>
                      <span className="font-black text-white text-sm">&lt; 1 Hour</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-200 uppercase font-bold block">On-Time Dispatch</span>
                      <span className="font-black text-emerald-400 text-sm">99.4%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-200 uppercase font-bold block">Warranty</span>
                      <span className="font-black text-white text-sm">2 Years</span>
                    </div>
                  </div>

                  <Link
                    to={`/store/${getStoreSlug(details.vendor)}`}
                    className="block w-full py-3 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl text-center shadow-md transition"
                  >
                    Visit {details.vendor} Storefront →
                  </Link>
                </div>
              </div>
            </div>

            {/* ================= BOTTOM SECTION: CUSTOMER REVIEWS & RATINGS ================= */}
            <div className="pt-4">
              <CustomerReviewsSection
                targetId={product._id || id}
                targetTitle={product.name}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}