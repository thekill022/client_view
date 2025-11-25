import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function PromoBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerSlides, setBannerSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/banner/highlight")
      .then((res) => res.json())
      .then((data) => {
        const slides = (data.data || []).map((b) => ({
          id: b.id,
          image: b.url,
          alt: `Banner ${b.id}`,
        }));
        setBannerSlides(slides);
      })
      .catch((err) => {
        console.error("Failed to fetch banners", err);
        setBannerSlides([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    if (!bannerSlides.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  // Jangan render kalau banner kosong atau loading
  if (loading || bannerSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
      </div>

      {/* Particle Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Carousel Container */}
        <div className="relative w-full">
          {/* Banner Card Container */}
          <div className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
            {/* Banner Slides */}
            <div className="relative w-full aspect-[26/9]">
              {bannerSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  {/* Banner Image */}
                  <ImageWithFallback
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                  />

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-slate-900/20" />
                </div>
              ))}

              {/* Dot Indicators - Inside Banner Card */}
              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {bannerSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 rounded-full backdrop-blur-sm ${
                      idx === currentSlide
                        ? "w-8 md:w-10 h-2 md:h-2.5 bg-white shadow-lg"
                        : "w-2 md:w-2.5 h-2 md:h-2.5 bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Card Border Glow Effect */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/10 pointer-events-none" />
          </div>

          {/* Left Arrow Button - Overlaying Banner */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-slate-900/70 backdrop-blur-md text-white p-2.5 md:p-3.5 rounded-full hover:bg-slate-900/90 transition-all hover:scale-110 border border-white/20 shadow-2xl group z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Right Arrow Button - Overlaying Banner */}
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-slate-900/70 backdrop-blur-md text-white p-2.5 md:p-3.5 rounded-full hover:bg-slate-900/90 transition-all hover:scale-110 border border-white/20 shadow-2xl group z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
