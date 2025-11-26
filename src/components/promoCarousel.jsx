import { useState, useEffect, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config/api";

const gradients = [
  "from-purple-600 to-pink-600",
  "from-red-600 to-orange-600",
  "from-blue-600 to-cyan-600",
  "from-orange-600 to-yellow-600",
  "from-yellow-600 to-orange-600",
  "from-indigo-600 to-purple-600",
  "from-purple-600 to-blue-600",
  "from-green-600 to-emerald-600",
];

const getRandomGradient = () =>
  gradients[Math.floor(Math.random() * gradients.length)];

export function PromoCarousel({ lang }) {
  const [currentIndex, setCurrentIndex] = useState(0); // index halaman (page) carousel
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  // useEffect fetch
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
        }));
        setAllProducts(mapped);
      })
      .catch((err) => {
        console.error("Failed to fetch highlights", err);
        setAllProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Bagi produk menjadi halaman (page) berisi maksimal 4 item
  const pages = useMemo(() => {
    if (!allProducts.length) return [];
    const result = [];
    for (let i = 0; i < allProducts.length; i += 4) {
      result.push(allProducts.slice(i, i + 4));
    }
    return result;
  }, [allProducts]);

  // Auto slide per halaman
  useEffect(() => {
    if (!pages.length) return;
    if (pages.length === 1) return; // hanya satu halaman, tidak perlu auto-slide

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

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="absolute inset-0">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-4">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-blue-100">{t("hot_deals")}</span>
          </div>
          <h2 className="text-white mb-4">{t("premium_accounts")}</h2>
          <p className="text-blue-200 max-w-2xl mx-auto">{t("exclusive")}</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-200 text-sm">{t("loading")}</p>
            </div>
          </div>
        ) : allProducts.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/90 backdrop-blur-xl rounded-full mb-6 border border-slate-700/50">
                <Zap className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-white mb-2">No Offers Available</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                There are no highlighted deals at the moment. Check back later
                for exciting offers!
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-opacity duration-300 ${
                isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {displayedProducts.map((product, index) => (
            <div
              key={`${product.id}-${currentIndex}`}
              className="group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${product.gradient} rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500`}
              />
              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500">
                <div className="relative aspect-[9/13] overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-fit object-center group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`bg-gradient-to-r ${product.gradient} border-0 shadow-lg backdrop-blur-sm`}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {product.rank}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/50 backdrop-blur-sm">
                  <div className="flex flex-col gap-2">
                    <div>
                      <p className="text-xs text-gray-400">{t("price")}</p>
                      <p className="text-white text-sm">
                        {lang === "id"
                          ? `Rp ${Number(
                              product.harga_rupiah
                            ).toLocaleString()}`
                          : lang === "en"
                          ? `$ ${Number(product.harga_dolar).toLocaleString()}`
                          : `RM ${Number(
                              product.harga_ringgit
                            ).toLocaleString()}`}
                      </p>
                    </div>
                    <a href={"/preview/" + product.id}>
                      <Button
                        size="sm"
                        className={`w-full bg-gradient-to-r ${product.gradient} hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 border-0 group-hover:scale-105 text-xs`}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {t("buy")}
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
              </div>
              ))}
            </div>
          </div>
        )}

        {!loading && pages.length > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {pages.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentIndex === i ? "w-12 bg-blue-500" : "w-6 bg-blue-500/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
