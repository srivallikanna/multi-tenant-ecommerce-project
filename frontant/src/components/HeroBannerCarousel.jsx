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
      tag: "Best Audio Deals",
    },
    {
      id: 2,
      image: "/images/banner_slide_2.jpg",
      title: "Flat 40% Off on Luxury Chronograph Watches",
      vendor: "Srivalli's Store",
      storeSlug: "srivalli-store",
      tag: "Trending Horology",
    },
    {
      id: 3,
      image: "/images/banner_slide_3.jpg",
      title: "Flat 35% Off on Botanical Skincare & Serums",
      vendor: "Riya's Store",
      storeSlug: "riya-store",
      tag: "Clean Beauty Sale",
    },
    {
      id: 4,
      image: "/images/banner_slide_4.jpg",
      title: "Flat 45% Off on Urban Sneakers & Apparel",
      vendor: "Anuj's Store",
      storeSlug: "anuj-store",
      tag: "Streetwear Drops",
    },
  ];

  // Circular extended array: [CloneLast, ...Slides, CloneFirst]
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const isTransitioningRef = useRef(false);

  // Auto slide forward every 3.5s in continuous circular loop
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
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
    if (currentIndex === extendedSlides.length - 1) {
      setWithTransition(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setWithTransition(false);
      setCurrentIndex(slides.length);
    }
  };

  // Compute active dot index
  const activeDotIndex =
    currentIndex === 0
      ? slides.length - 1
      : currentIndex === extendedSlides.length - 1
      ? 0
      : currentIndex - 1;

  return (
    <div className="relative max-w-7xl mx-auto w-full h-[180px] sm:h-[260px] md:h-[320px] lg:h-[350px] rounded-2xl overflow-hidden shadow-sm border border-slate-200 group bg-slate-100">
      {/* Sliding Images Track */}
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
            {/* Subtle gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none"></div>

            {/* Corner Store Badge */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-1.5 text-xs font-black text-slate-800 hover:text-[#2874f0] transition">
              <span>🏪</span>
              <span>{slide.vendor}</span>
              <span className="text-[#2874f0]">→</span>
            </div>

            {/* Bottom info banner */}
            <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 z-10 text-white">
              <span className="px-2.5 py-0.5 rounded bg-[#ff9f00] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-xs mb-1 inline-block">
                {slide.tag}
              </span>
              <h3 className="text-sm sm:text-xl font-black drop-shadow-md text-white">
                {slide.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 z-20 w-8 h-12 sm:w-9 sm:h-16 rounded bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer"
        aria-label="Previous Slide"
      >
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 z-20 w-8 h-12 sm:w-9 sm:h-16 rounded bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg border border-slate-200 transition opacity-0 group-hover:opacity-100 active:scale-95 cursor-pointer"
        aria-label="Next Slide"
      >
        <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators Dots */}
      <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setWithTransition(true);
              setCurrentIndex(idx + 1);
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeDotIndex === idx
                ? "w-4 h-1.5 bg-[#2874f0]"
                : "w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
