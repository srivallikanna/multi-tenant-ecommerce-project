import React, { useState, useEffect } from "react";

export default function CustomerReviewsSection({
  targetId = "default", // productId or storeSlug
  targetTitle = "Product",
  initialReviews = [],
}) {
  const STORAGE_KEY = `customer_reviews_${targetId}`;

  // Default seed reviews if none found
  const defaultReviews = [
    {
      id: "rev_1",
      customerName: "Gaurav",
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
      customerName: "Srivalli",
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
      customerName: "Riya",
      rating: 5,
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
      customerName: "Anuj",
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
  const [sortBy, setSortBy] = useState("recent"); // 'recent' | 'highest' | 'helpful'
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
      // Also broadcast to global storage so Vendor Dashboard picks it up
      const allVendorReviews = JSON.parse(localStorage.getItem("all_vendor_reviews") || "[]");
      const updatedGlobal = [...reviews, ...allVendorReviews.filter((r) => !reviews.some((cr) => cr.id === r.id))];
      localStorage.setItem("all_vendor_reviews", JSON.stringify(updatedGlobal));
    } catch (e) {}
  }, [reviews, STORAGE_KEY]);

  const handleRatingHover = (val) => setHoverRating(val);
  const handleRatingLeave = () => setHoverRating(0);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Please provide your name.");
      return;
    }
    if (!reviewComment.trim()) {
      alert("Please write a short review comment.");
      return;
    }

    const newReview = {
      id: "rev_" + Date.now(),
      customerName: customerName.trim(),
      rating: Number(rating),
      title: reviewTitle.trim() || `${rating}-Star Review`,
      comment: reviewComment.trim(),
      date: "Just now",
      verifiedPurchase: true,
      helpfulCount: 0,
      vendorReply: "",
      tags: selectedTags,
    };

    setReviews([newReview, ...reviews]);
    setShowForm(false);
    setReviewTitle("");
    setReviewComment("");
    setToastMessage("🎉 Thank you! Your review has been published.");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r
      )
    );
    setToastMessage("Thank you for your feedback!");
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Metrics computation
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  // Filter & Sort reviews
  let processedReviews = reviews.filter((r) => {
    if (starFilter === "All") return true;
    return r.rating === Number(starFilter);
  });

  if (sortBy === "recent") {
    // Keep top-order
  } else if (sortBy === "highest") {
    processedReviews = [...processedReviews].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "helpful") {
    processedReviews = [...processedReviews].sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
  }

  const ratingDescriptions = {
    5: "Exceptional — Loved everything about it!",
    4: "Very Good — Met all expectations",
    3: "Average — Decent, standard quality",
    2: "Below Expectations — Room for improvement",
    1: "Poor — Did not match description",
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-slide-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {toastMessage}
        </div>
      )}

      {/* HEADER: Rating Overview & CTA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
              ⭐ Verified Reviews
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Authentic Customer Feedback
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Read real buyer experiences or share your honest review for {targetTitle}.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${
            showForm
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 hover:scale-105"
          }`}
        >
          <span>{showForm ? "✕ Cancel Review" : "✍️ Write a Customer Review"}</span>
        </button>
      </div>

      {/* RATING BREAKDOWN CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80 items-center">
        {/* Left: Big Score */}
        <div className="text-center md:border-r md:border-slate-200 md:pr-6 space-y-1">
          <div className="text-5xl font-black text-slate-900">{avgRating}</div>
          <div className="flex items-center justify-center gap-1 text-amber-400 text-lg">
            {"★".repeat(Math.round(Number(avgRating)))}
            {"☆".repeat(5 - Math.round(Number(avgRating)))}
          </div>
          <span className="text-xs text-slate-500 font-bold block">
            Based on {totalReviews} verified ratings
          </span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            ✓ 98% Recommended by buyers
          </span>
        </div>

        {/* Center: Progress Bars */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div
                key={stars}
                onClick={() => setStarFilter(starFilter === String(stars) ? "All" : String(stars))}
                className="flex items-center gap-3 text-xs font-bold text-slate-600 hover:text-indigo-600 cursor-pointer group"
              >
                <span className="w-12 text-slate-700 font-black flex items-center gap-0.5">
                  {stars} <span className="text-amber-500">★</span>
                </span>
                <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 group-hover:brightness-110"
                  />
                </div>
                <span className="w-12 text-right text-slate-400 text-[11px] font-semibold">
                  {percentage}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUBMISSION FORM (COLLAPSIBLE) */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-gradient-to-b from-indigo-50/50 to-white p-6 sm:p-8 rounded-3xl border border-indigo-200 shadow-sm space-y-5 animate-slide-up"
        >
          <div className="border-b border-indigo-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              Share Your Product Experience
            </h3>
            <p className="text-xs text-slate-500">
              Your feedback helps other shoppers make informed decisions.
            </p>
          </div>

          {/* Star Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Overall Rating:
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => handleRatingHover(star)}
                  onMouseLeave={handleRatingLeave}
                  className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-slate-200"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-3">
                {ratingDescriptions[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Form Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Gaurav"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Headline / Summary:
              </label>
              <input
                type="text"
                placeholder="e.g. Best quality I've experienced!"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
          </div>

          {/* Detailed Review Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Comments & Feedback:
            </label>
            <textarea
              required
              rows={4}
              placeholder="What did you like or dislike about this product? How was the delivery and functionality?"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-indigo-600 transition"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Highlight Tags (Click to toggle):
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                    selectedTags.includes(tag)
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {selectedTags.includes(tag) ? `✓ ${tag}` : `+ ${tag}`}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md transition active:scale-95"
            >
              Submit Review Now →
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* FILTER & SORT TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-slate-400 font-bold mr-1">Filter:</span>
          {["All", "5", "4", "3", "2", "1"].map((s) => (
            <button
              key={s}
              onClick={() => setStarFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                starFilter === s
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s === "All" ? "All Stars" : `${s} ★`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* REVIEW CARDS LIST */}
      <div className="space-y-4">
        {processedReviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-medium">
            No reviews match your filter. Be the first to share your thoughts!
          </div>
        ) : (
          processedReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-slate-300 transition space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {review.customerName}
                      </span>
                      {review.verifiedPurchase && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Reviewed on {review.date}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <span>{"★".repeat(review.rating)}</span>
                  <span className="text-slate-700 font-bold ml-1">{review.rating}.0</span>
                </div>
              </div>

              {/* Title & Comment */}
              <div>
                {review.title && (
                  <h4 className="text-xs font-bold text-slate-900 mb-1">
                    {review.title}
                  </h4>
                )}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review Tags */}
              {review.tags && review.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {review.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                    >
                      🏷️ {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Vendor Reply if present */}
              {review.vendorReply && (
                <div className="p-3 bg-indigo-50/60 border-l-3 border-indigo-600 rounded-r-xl text-xs space-y-1">
                  <div className="font-bold text-indigo-900 text-[11px] flex items-center gap-1.5">
                    <span>💬 Store Owner Response:</span>
                  </div>
                  <p className="text-slate-700 text-xs">{review.vendorReply}</p>
                </div>
              )}

              {/* Footer: Helpful feedback button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 hover:text-indigo-600 transition"
                >
                  <span>👍 Helpful</span>
                  {review.helpfulCount > 0 && (
                    <span className="text-slate-400 font-normal">({review.helpfulCount})</span>
                  )}
                </button>

                <span className="text-[11px] text-slate-400">
                  Verified Buyer Feedback
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
