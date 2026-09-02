// Real Coupon and Discount Utilities

export const AVAILABLE_COUPONS = [
  {
    code: 'WELCOME50',
    title: 'Flat ₹50 OFF',
    description: 'Special introductory discount on your order',
    type: 'FLAT',
    discount: 50,
    minOrder: 199,
    maxDiscount: 50,
    tag: 'NEW USER',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    highlight: 'Instant ₹50 Off on orders above ₹199',
  },
  {
    code: 'SAVE20',
    title: '20% Mega Savings',
    description: 'Get 20% discount on cart value up to ₹300',
    type: 'PERCENTAGE',
    discount: 20,
    minOrder: 399,
    maxDiscount: 300,
    tag: 'TRENDING',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    highlight: 'Save up to ₹300 on orders above ₹399',
  },
  {
    code: 'MEGA30',
    title: '30% Festive Bonanza',
    description: 'Get 30% discount on cart value up to ₹600',
    type: 'PERCENTAGE',
    discount: 30,
    minOrder: 899,
    maxDiscount: 600,
    tag: 'LIMITED TIME',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    highlight: 'Save up to ₹600 on orders above ₹899',
  },
  {
    code: 'FREESHIP',
    title: '100% Free Express Delivery',
    description: 'Free doorstep shipping on any order',
    type: 'FREE_SHIPPING',
    discount: 40,
    minOrder: 0,
    maxDiscount: 40,
    tag: 'ZERO DELIVERY FEE',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    highlight: 'Zero delivery charges with priority packaging',
  },
  {
    code: 'FLAT100',
    title: 'Flat ₹100 Super Saver',
    description: 'Instant flat ₹100 discount on orders above ₹499',
    type: 'FLAT',
    discount: 100,
    minOrder: 499,
    maxDiscount: 100,
    tag: 'POPULAR',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    highlight: 'Save Flat ₹100 instantly on min order ₹499',
  },
];

/**
 * Validate and calculate discount for a given promo code
 * @param {string} code - coupon code
 * @param {number} subtotal - cart subtotal
 * @param {number} standardShipping - current shipping charge
 * @returns {object} { isValid, discountAmount, freeShipping, message, coupon }
 */
export function calculateCouponDiscount(code, subtotal = 0, standardShipping = 40) {
  if (!code || !code.trim()) {
    return { isValid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find((c) => c.code === normalized);

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Coupon code "${code}" is invalid or expired. Try using SAVE20 or WELCOME50.`,
    };
  }

  if (subtotal < coupon.minOrder) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Add items worth ₹${(coupon.minOrder - subtotal).toFixed(2)} more to apply ${coupon.code} (Min order: ₹${coupon.minOrder}).`,
    };
  }

  let discountAmount = 0;
  let freeShipping = false;

  if (coupon.type === 'FLAT') {
    discountAmount = Math.min(coupon.discount, subtotal);
  } else if (coupon.type === 'PERCENTAGE') {
    const rawDiscount = (subtotal * coupon.discount) / 100;
    discountAmount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);
  } else if (coupon.type === 'FREE_SHIPPING') {
    freeShipping = true;
    discountAmount = standardShipping;
  }

  return {
    isValid: true,
    code: coupon.code,
    coupon,
    discountAmount: Math.round(discountAmount * 100) / 100,
    freeShipping,
    message: `🎉 Success! "${coupon.code}" applied. You saved ₹${discountAmount.toFixed(2)}!`,
  };
}
