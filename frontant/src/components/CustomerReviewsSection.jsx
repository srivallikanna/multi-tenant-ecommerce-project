import React, { useState, useEffect } from "react";

export default function CustomerReviewsSection({
  targetId = "default", // productId or storeSlug
  targetTitle = "Product",
  initialReviews = [],
}) {
  const STORAGE_KEY = `customer_reviews_${targetId}`;

  // Default seed reviews
  const defaultReviews = [
    {
      id: "rev_1",
      customerName: "Gaurav S.",
      rating: 5,
      title: "Outstanding build quality and fast shipping!",
      comment: "Super impressed with this purchase. Sound clarity is unbelievable and the packaging was top tier. Definitely ordering again.",
      date: "Aug 17, 2026",
      verifiedPurchase: true,
      helpfulCount: 24,
      vendorReply: "Thank you Gaurav! We appreciate your support and hope you enjoy the gear!",
      tags: ["High Quality", "Fast Shipping", "Recommended"],
    },
    {
      id: "rev_2",
      customerName: "Srivalli K.",
      rating: 5,
      title: "Worth every single penny!",
      comment: "Exceeded my expectations. Great battery life and very comfortable for long sessions. 10/10 recommend.",
      date: "Aug 15, 2026",
      verifiedPurchase: true,
      helpfulCount: 18,
      vendorReply: "Thank you Srivalli for the wonderful review!",
      tags: ["Great Value", "Recommended"],
    },
    {
      id: "rev_3",
      customerName: "Riya M.",
      rating: 4,
      title: "Solid product, very happy with performance",
      comment: "Works exactly as described. Material feels durable and customer service was quick to respond to my inquiries.",
      date: "Aug 12, 2026",
      verifiedPurchase: true,
      helpfulCount: 12,
      vendorReply: "Thanks Riya! Feel free to reach out anytime if you need tips.",
      tags: ["Great Value"],
    },
    {
      id: "rev_4",
      customerName: "Anuj B.",
      rating: 5,
      title: "Fast delivery & premium packaging",
      comment: "Arrived earlier than scheduled. The quality is supreme and feels very robust.",
      date: "Aug 10, 2026",
      verifiedPurchase: true,
      helpfulCount: 9,
      vendorReply: "Appreciate your business Anuj! Enjoy!",
      tags: ["Fast Shipping", "High Quality"],
    },
  ];

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialReviews.length > 0 ? initialReviews : defaultReviews;
  });

  const [showForm, setShowForm] = useState(false);
  const [starFilter, setStarFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [toastMessage, setToastMessage] = useState("");

  // Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u.name || "";
      } catch (e) {}
    }
    return "";
  });
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState(["High Quality"]);

  const availableTags = ["High Quality", "Fast Shipping", "Great Value", "Easy Setup", "Recommended"];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
      const allVendorReviews = JSON.parse(localStorage.getItem("all_vendor_reviews") || "[]");
      const updatedGlobal = [...reviews, ...allVendorReviews.filter((r) => !reviews.some((cr) => cr.id === r.id))];
      localStorage.setItem("all_vendor_reviews", JSON.stringify(updatedGlobal));
    } catch (e) {}
  }, [reviews, STORAGE_KEY]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      alert("Please enter a review headline and comment.");
      return;
    }

    const newReview = {
      id: `rev_${Date.now()}`,
      customerName: customerName.trim() || "Verified Shopper",
      rating: Number(rating),
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      verifiedPurchase: true,
      helpfulCount: 0,
      tags: selectedTags,
    };

    setReviews([newReview, ...reviews]);
    setReviewTitle("");
    setReviewComment("");
    setShowForm(false);
    setToastMessage("Thank you! Your verified review has been posted 🎉");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleHelpful = (id) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
  };

  const filteredReviews = reviews.filter((r) => {
    if (starFilter === "All") return true;
    return Number(r.rating) === Number(starFilter);
  }).sort((a, b) => {
    if (sortBy === "helpful") return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    if (sortBy === "rating_high") return b.rating - a.rating;
    if (sortBy === "rating_low") return a.rating - b.rating;
    return 0; // recent
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Overall Summary */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        {/* Left Rating Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              Ratings & Reviews
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#388e3c] text-white px-3 py-1.5 rounded-xl font-black text-2xl shadow-xs">
              <span>{avgRating}</span>
              <span className="text-base">★</span>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">
                {reviews.length} Verified Customer Ratings
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                100% Authentic Customer Feedback
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 max-w-xs space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                <span className="w-6">{star} ★</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      star >= 4 ? "bg-[#388e3c]" : star === 3 ? "bg-amber-400" : "bg-rose-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[11px] text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Rate Product Button */}
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-[#2874f0] hover:bg-[#1e60db] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            {showForm ? "Cancel Review" : "★ Rate & Review Product"}
          </button>
        </div>
      </div>

      {/* Review Submission Form Drawer */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 animate-slide-down">
          <h4 className="text-sm font-black text-slate-900">Write a Verified Review for {targetTitle}</h4>
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Overall Rating:</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  className={`text-2xl cursor-pointer transition-transform ${
                    (hoverRating || rating) >= s ? "text-amber-400 scale-110" : "text-slate-300"
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-600">{rating} Stars</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Gaurav S."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Exceptional sound clarity & comfortable!"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review</label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you like or dislike? How does it perform?"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2874f0]"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#ff9f00] hover:bg-[#f59400] text-slate-950 text-xs font-black rounded-lg shadow-xs cursor-pointer"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Review Filter Pills & Sorter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {["All", "5", "4", "3", "2", "1"].map((s) => (
            <button
              key={s}
              onClick={() => setStarFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                starFilter === s
                  ? "bg-[#2874f0] text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s === "All" ? "All Stars" : `${s} ★`}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating_high">Highest Rating</option>
          <option value="rating_low">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-slate-100 space-y-4 pt-2">
        {filteredReviews.map((rev) => (
          <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#388e3c] text-white text-[11px] font-black px-2 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                <span>{rev.rating}</span>
                <span>★</span>
              </span>
              <h4 className="text-xs font-bold text-slate-900">{rev.title}</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {rev.comment}
            </p>

            {/* Author info & Helpful counter */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">{rev.customerName}</span>
                <span>•</span>
                {rev.verifiedPurchase && (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span>✓</span> Certified Buyer
                  </span>
                )}
                <span>•</span>
                <span>{rev.date}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleHelpful(rev.id)}
                  className="hover:text-[#2874f0] transition flex items-center gap-1 cursor-pointer font-bold"
                >
                  <span>👍</span>
                  <span>Helpful ({rev.helpfulCount || 0})</span>
                </button>
              </div>
            </div>

            {/* Vendor Reply if present */}
            {rev.vendorReply && (
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-1 mt-2">
                <span className="text-[10px] font-black uppercase text-[#2874f0] tracking-wider">
                  Official Merchant Reply:
                </span>
                <p className="text-slate-700 text-xs italic">{rev.vendorReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
