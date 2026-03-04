import { useState, useEffect, useMemo } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config/api";
import FlashSaleBanner from "./flasSale";

const gradients = [
  "from-purple-600 to-pink-600",
  "from-red-600 to-orange-600",
  "from-orange-600 to-yellow-600",
  "from-yellow-600 to-orange-600",
  "from-purple-600 to-blue-600",
  "from-green-600 to-emerald-600",
];

const getRandomGradient = () =>
  gradients[Math.floor(Math.random() * gradients.length)];

export function PromoCarousel({ lang }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);

  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl("/api/produk/highlight"))
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort((a, b) => b.id - a.id);
        const mapped = sorted.map((p) => ({
          id: p.id,
          name: p.nama,
          rank: p.rank,
          description: p.deskripsi,
          harga_rupiah: p.harga_rupiah ?? 0,
          harga_dolar: p.harga_dolar ?? 0,
          harga_ringgit: p.harga_ringgit ?? 0,
          discount: `${p.diskon ?? 0}%`,
          image: p.produkimg[0]?.link || "",
          gradient: getRandomGradient(),
          status: p.status ?? true,
        }));
        setAllProducts(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch highlights", err);
        setAllProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const pages = useMemo(() => {
    if (!allProducts.length) return [];
    const result = [];
    for (let i = 0; i < allProducts.length; i += 4) {
      result.push(allProducts.slice(i, i + 4));
    }
    return result;
  }, [allProducts]);

  useEffect(() => {
    if (!pages.length) return;
    if (pages.length === 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % pages.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [pages.length]);

  const displayedProducts = pages.length ? pages[currentIndex] : [];

  // flash sale logicnya
  useEffect(() => {
    let timeout;

    fetch(getApiUrl("/api/flash-sale"))
      .then((res) => {
        if (!res.ok) throw new Error("Flash sale not found");
        return res.json();
      })
      .then((res) => {
        const flash = res.data;
        if (!flash?.start_date || !flash?.end_date) {
          setIsFlashSaleActive(false);
          return;
        }

        const now = new Date();
        const start = new Date(flash.start_date);
        const end = new Date(flash.end_date);

        const isActive = now >= start && now <= end;
        setIsFlashSaleActive(isActive);

        if (isActive) {
          const msUntilEnd = end.getTime() - now.getTime();
          timeout = setTimeout(() => {
            setIsFlashSaleActive(false);
          }, msUntilEnd);
        }
      })
      .catch(() => setIsFlashSaleActive(false));

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative py-16 pt-10 overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />

      <div className="relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white text-2xl sm:text-3xl md:text-5xl font-black mb-8 sm:mb-12 italic uppercase drop-shadow-md tracking-tighter">
          {t("popular")} <span className="text-red-600">!!!</span>
        </div>

        <FlashSaleBanner />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-md animate-spin" />
          </div>
        ) : allProducts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center text-white">
              <Zap className="h-10 w-10 mx-auto mb-2 opacity-70" />
              <h3>No Offers Available</h3>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 transition-all duration-300 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {displayedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${currentIndex}`}
                  className="relative group h-full"
                >
                  {/* --- CARD CONTAINER UTAMA --- */}
                  <div className="relative flex flex-col h-full bg-[#007aff] rounded-lg sm:rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                    {/* --- SOLD OVERLAY --- */}
                    {!product.status && (
                      <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                        <div className=" px-6 py-3">
                          <h2 className="text-red-500 font-black text-lg sm:text-xl md:text-2xl italic uppercase tracking-wider drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">
                            {lang === "en" ? "SOLD" : "TERJUAL"}
                          </h2>
                        </div>
                      </div>
                    )}

                    {/* --- DISKON BADGE (Pojok Kanan Atas) --- */}
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 z-20">
                      {isFlashSaleActive ? (
                        <img
                          src="/assets/images/flash.png"
                          alt="Flash Sale"
                          className="h-16 md:h-30 w-auto drop-shadow-xl animate-pulse"
                        />
                      ) : (
                        <div className="bg-[#FF0000] text-yellow-300 font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-bl-[15px] sm:rounded-bl-[25px] rounded-tr-[12px] sm:rounded-tr-[20px] shadow-lg border-b border-l sm:border-b-2 sm:border-l-2 border-white/20 transform skew-x-[-5deg]">
                          DISKON {product.discount}
                        </div>
                      )}
                    </div>

                    {/* --- IMAGE AREA (Mengisi sebagian besar atas) --- */}
                    <div className="pb-0 flex-grow relative min-h-[120px] sm:min-h-[140px] md:min-h-[180px]">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* --- INFO SECTION (Footer Biru) --- */}
                    <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-1.5 sm:pt-2 relative z-10">
                      {/* Judul Produk */}
                      <h3 className="text-white font-black text-xs xs:text-sm sm:text-base md:text-xl italic uppercase leading-tight tracking-wide drop-shadow-md line-clamp-1 min-h-[1em] mb-1 sm:mb-1.5">
                        {product.name}
                      </h3>

                      <div className="flex justify-between items-end mb-2 sm:mb-3 gap-1">
                        {/* Bagian Harga (Kiri) */}
                        <div className="flex flex-col flex-1 min-w-0">
                          {/* Harga Coret Merah */}
                          <div className="relative w-fit mb-0.5">
                            <span className="text-white/60 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold italic whitespace-nowrap">
                              {lang === "id"
                                ? `RP.${Number(
                                    product.harga_rupiah,
                                  ).toLocaleString()}`
                                : lang === "ms"
                                  ? `RM${Number(
                                      product.harga_ringgit,
                                    ).toLocaleString()}`
                                  : `$${Number(
                                      product.harga_dolar,
                                    ).toLocaleString()}`}
                            </span>
                            <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-red-600 -rotate-2"></div>
                          </div>
                          {/* Harga Utama */}
                          <div className="text-white font-black text-xs xs:text-sm sm:text-base md:text-2xl italic leading-none tracking-tight">
                            {lang === "id"
                              ? `Rp.${Math.round(
                                  (product.harga_rupiah *
                                    (100 -
                                      parseInt(
                                        product.discount.replace("%", ""),
                                      ))) /
                                    100,
                                ).toLocaleString()}`
                              : lang === "ms"
                                ? `RM${Math.round(
                                    (product.harga_ringgit *
                                      (100 -
                                        parseInt(
                                          product.discount.replace("%", ""),
                                        ))) /
                                      100,
                                  ).toLocaleString()}`
                                : `$${Math.round(
                                    (product.harga_dolar *
                                      (100 -
                                        parseInt(
                                          product.discount.replace("%", ""),
                                        ))) /
                                      100,
                                  ).toLocaleString()}`}
                          </div>
                        </div>
                      </div>

                      {/* --- TOMBOL BUY (Dibawah Free/Harga) --- */}
                      <a
                        href={"/preview/" + product.id}
                        className="block w-full"
                      >
                        <Button
                          className={`w-full bg-gradient-to-r ${product.gradient} text-white font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-base py-2 sm:py-3 md:py-5 rounded-lg sm:rounded-xl hover:translate-y-[2px] transition-all border-none uppercase tracking-wider`}
                        >
                          <ShoppingCart className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-0.5 xs:mr-1 md:mr-2" />
                          <span className="leading-none">{t("buy")}</span>
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination Dots */}
        {!loading && pages.length > 1 && (
          <div className="flex justify-center gap-2 mt-8 sm:mt-12">
            {pages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 shadow ${
                  currentIndex === i
                    ? "w-8 sm:w-10 bg-[#FFD700]"
                    : "w-2 sm:w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
