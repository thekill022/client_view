import { useEffect, useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getApiUrl } from "../config/api";

export function PromoBanner() {
  const [slides, setSlides] = useState([]);
  const splideRef = useRef(null);

  useEffect(() => {
    fetch(getApiUrl("/api/banner/highlight"))
      .then((res) => res.json())
      .then((data) => {
        const mapped = (data.data || []).map((b) => ({
          id: b.id,
          image: b.url,
          alt: `Banner ${b.id}`,
        }));
        setSlides(mapped);
      })
      .catch(() => setSlides([]));
  }, []);

  if (!slides.length) return null;

  return (
    <section className="relative py-10 md:py-14 lg:py-18 overflow-visible overflow-x-hidden bg-[url('/assets/images/bg-banner.png')] bg-cover bg-center">
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 overflow-visible">
        <Splide
          ref={splideRef}
          options={{
            type: "loop",
            focus: "center",
            perPage: 1,
            gap: "60px", // GAP DIKEMBALIKAN
            padding: { left: "10%", right: "10%" },
            arrows: false,
            pagination: false,
            autoplay: slides.length > 1,
            interval: 3000,
            speed: 700,
            drag: true,
            breakpoints: {
              1024: {
                padding: { left: "14%", right: "14%" },
                gap: "60px",
              },
              768: {
                padding: { left: "12%", right: "12%" },
                gap: "40px",
              },
              480: {
                padding: { left: "10%", right: "10%" },
                gap: "20px",
              },
            },
          }}
          className="promo-splide"
        >
          {slides.map((slide) => (
            <SplideSlide key={slide.id}>
              <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full aspect-[20/9] sm:aspect-[21/9] md:aspect-[22/9] object-cover rounded-xl sm:rounded-2xl md:rounded-3xl"
                />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-t from-black/35 via-transparent to-black/15" />
              </div>
            </SplideSlide>
          ))}
        </Splide>

        {/* Arrow kiri */}
        <button
          onClick={() => splideRef.current?.splide.go("<")}
          className="
          absolute
          left-4
          sm:left-4
          md:left-10
          lg:left-22
          xl:left-14
          top-1/2
          -translate-y-1/2
          z-30
          "
        >
          <img
            src="/assets/images/kiri.png"
            className="h-5 sm:h-8 md:h-10 lg:h-12 xl:h-14"
            alt="Prev"
          />
        </button>

        {/* Arrow kanan */}
        <button
          onClick={() => splideRef.current?.splide.go(">")}
          className="
            absolute
            right-4
            sm:right-4
            md:right-10
            lg:right-22
            xl:right-14
            top-1/2
            -translate-y-1/2
            z-30
          "
        >
          <img
            src="/assets/images/kanan.png"
            className="h-5 sm:h-8 md:h-10 lg:h-12 xl:h-14"
            alt="Next"
          />
        </button>
      </div>

      <style jsx>{`
        .promo-splide .splide__track {
          overflow: visible !important;
          transform: translateX(1.6%);
        }

        .promo-splide .splide__slide {
          transform: scale(0.92);
          transition: transform 0.45s ease;
        }

        .promo-splide .splide__slide.is-active {
          transform: scale(1.12);
          z-index: 20;
        }
      `}</style>
    </section>
  );
}
