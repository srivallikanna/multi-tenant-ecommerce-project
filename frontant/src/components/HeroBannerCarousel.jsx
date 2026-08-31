import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function HeroBannerCarousel() {
  const slides = [
    {
      id: 1,
      image: "/images/banner_slide_1.jpg",
      title: "Flat 50% Off on Premium Headphones & Audio",
      vendor: "Gaurav's Store",
      storeSlug: "gaurav-store",
    },
    {
      id: 2,
      image: "/images/banner_slide_2.jpg",
      title: "Flat 40% Off on Luxury Chronograph Watches",
      vendor: "Srivalli's Store",
      storeSlug: "srivalli-store",
    },
    {
      id: 3,
      image: "/images/banner_slide_3.jpg",
      title: "Flat 35% Off on Botanical Skincare & Serums",
      vendor: "Riya's Store",
      storeSlug: "riya-store",
    },
    {
      id: 4,
      image: "/images/banner_slide_4.jpg",
      title: "Flat 45% Off on Urban Sneakers & Apparel",
      vendor: "Anuj's Store",
      storeSlug: "anuj-store",
    },
  ];

  // Create circular extended array: [CloneLast, ...Slides, CloneFirst]
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const isTransitioningRef = useRef(false);

  // Auto slide forward every 3 seconds in a continuous circular loop
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setWithTransition(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    // If reached the cloned first slide at the end, snap silently back to real slide 1
    if (currentIndex === extendedSlides.length - 1) {
      setWithTransition(false);
      setCurrentIndex(1);
    }
    // If reached the cloned last slide at the start, snap silently back to real last slide
    else if (currentIndex === 0) {
      setWithTransition(false);
      setCurrentIndex(slides.length);
    }
  };

  // Compute active dot index (0 to slides.length - 1)
  const activeDotIndex =
    currentIndex === 0
      ? slides.length - 1
      : currentIndex === extendedSlides.length - 1
      ? 0
      : currentIndex - 1;

  return (
    <div className="relative max-w-7xl mx-auto w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[360px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 group bg-slate-100">
      {/* Sliding Images Track with Circular Animation */}
      <div
        className={`w-full h-full flex ${
          withTransition ? "transition-transform duration-700 ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, idx) => (
          <Link
            to={`/store/${slide.storeSlug}`}
            key={`${slide.id}-${idx}`}
            className="w-full h-full flex-shrink-0 relative bg-cover bg-center block cursor-pointer"
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            {/* Corner Store Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 shadow-md flex items-center gap-1.5 text-xs font-black text-slate-800 hover:bg-white transition">
              <span>🏪</span>
              <span className="text-indigo-600">{slide.vendor}</span>
              <span className="text-slate-400">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-3 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-md shadow-md border border-slate-200 transition opacity-80 group-hover:opacity-100 active:scale-95 cursor-pointer"
        aria-label="Previous Slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 right-3 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-md shadow-md border border-slate-200 transition opacity-80 group-hover:opacity-100 active:scale-95 cursor-pointer"
        aria-label="Next Slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setWithTransition(true);
              setCurrentIndex(idx + 1);
            }}
            className={`transition-all duration-300 rounded-full ${
              activeDotIndex === idx
                ? "w-5 h-2 bg-indigo-600"
                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

