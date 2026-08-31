// Bulletproof Image Resolution Utility with Guaranteed SVG Data URI Fallbacks

// Icon and Gradient Map for Product Categories & Keywords
const PRODUCT_ICON_MAP = [
  { keywords: ["headphone", "audio", "headset"], icon: "🎧", bgStart: "%234f46e5", bgEnd: "%237c3aed" },
  { keywords: ["earbud", "airpod", "tws"], icon: "🎙️", bgStart: "%230284c7", bgEnd: "%232563eb" },
  { keywords: ["keyboard", "keycap"], icon: "⌨️", bgStart: "%230d9488", bgEnd: "%23059669" },
  { keywords: ["mouse", "trackpad"], icon: "🖱️", bgStart: "%23475569", bgEnd: "%231e293b" },
  { keywords: ["camera", "action cam", "lens"], icon: "📷", bgStart: "%23ea580c", bgEnd: "%23c2410c" },
  { keywords: ["watch", "smartwatch", "chrono", "leather watch"], icon: "⌚", bgStart: "%230891b2", bgEnd: "%230e7490" },
  { keywords: ["shoe", "sneaker", "footwear"], icon: "👟", bgStart: "%23e11d48", bgEnd: "%23be123c" },
  { keywords: ["speaker", "soundbar"], icon: "🔊", bgStart: "%239333ea", bgEnd: "%236b21a8" },
  { keywords: ["laptop", "computer", "macbook"], icon: "💻", bgStart: "%232563eb", bgEnd: "%231d4ed8" },
  { keywords: ["jacket", "shirt", "apparel", "wear"], icon: "👕", bgStart: "%23059669", bgEnd: "%23047857" },
  { keywords: ["coffee", "mug", "maker"], icon: "☕", bgStart: "%2378350f", bgEnd: "%23451a03" },
  { keywords: ["bag", "backpack"], icon: "🎒", bgStart: "%23d97706", bgEnd: "%23b45309" },
];

/**
 * Generates an offline SVG Data URI for any product name and category
 */
export function generateProductSvg(name = "Product", category = "E-Commerce Item") {
  const lower = (name + " " + category).toLowerCase();
  let selected = PRODUCT_ICON_MAP.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );

  if (!selected) {
    selected = { icon: "📦", bgStart: "%234f46e5", bgEnd: "%236366f1" };
  }

  // Clean title for SVG display
  const displayTitle = name.length > 22 ? name.substring(0, 20) + "..." : name;
  const displayCategory = category.toUpperCase();

  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='${selected.bgStart}'/><stop offset='100%' stop-color='${selected.bgEnd}'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g)' rx='16'/><circle cx='200' cy='115' r='50' fill='white' fill-opacity='0.25'/><text x='200' y='132' font-size='44' text-anchor='middle'>${selected.icon}</text><text x='200' y='205' font-size='16' font-weight='800' fill='white' text-anchor='middle' font-family='system-ui, sans-serif'>${encodeURIComponent(displayTitle)}</text><text x='200' y='230' font-size='11' font-weight='700' fill='%23e0e7ff' text-anchor='middle' font-family='system-ui, sans-serif' letter-spacing='1'>${encodeURIComponent(displayCategory)}</text></svg>`;
}

/**
 * Resolves a product image URL. Returns product.image if available,
 * or generates an inline SVG Data URI if missing or relative.
 */
export function getProductImage(product) {
  if (!product) return generateProductSvg("Marketplace Item", "Product");

  const name =
    product.name ||
    product.title ||
    product.productName ||
    product.product?.name ||
    "Product";

  const category = product.category || product.product?.category || "Item";

  const imgCandidate =
    product.image ||
    product.img ||
    product.picture ||
    product.photo ||
    product.product?.image ||
    "";

  if (typeof imgCandidate === "string" && imgCandidate.trim() !== "") {
    if (imgCandidate.startsWith("http://") || imgCandidate.startsWith("https://") || imgCandidate.startsWith("data:image/")) {
      return imgCandidate;
    }
    if (
      imgCandidate === "/images/headphones.jpg" ||
      imgCandidate === "/images/headphones_2.jpg" ||
      imgCandidate === "/images/keyboard.jpg" ||
      imgCandidate === "/images/camera.jpg" ||
      imgCandidate === "/images/watch.jpg" ||
      imgCandidate === "/images/shoes.jpg" ||
      imgCandidate === "/images/coffee.jpg"
    ) {
      return imgCandidate;
    }
  }

  return generateProductSvg(name, category);
}

/**
 * Bulletproof onError handler for <img> elements.
 * Immediately switches to SVG Data URI so it CANNOT fail to display.
 */
export function handleImageError(e, productOrCategory, customName) {
  let productName = "Product";
  let categoryName = "Electronics";

  if (typeof productOrCategory === "object" && productOrCategory !== null) {
    productName =
      productOrCategory.name ||
      productOrCategory.title ||
      productOrCategory.productName ||
      "Product";
    categoryName = productOrCategory.category || "Electronics";
  } else if (typeof productOrCategory === "string") {
    categoryName = productOrCategory;
    if (customName) productName = customName;
  }

  e.target.onerror = null;
  e.target.src = generateProductSvg(productName, categoryName);
}
