import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, Star, Filter, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { getApiUrl } from "../config/api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

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

export function Product({ onProductClick, lang }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridView, setGridView] = useState("4");
  const [allProducts, setAllProducts] = useState([]);
  const itemsPerPage = 8;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);

  const [originalProducts, setOriginalProducts] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get("search") || "";

  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    setLoadingProducts(true);
    fetch(getApiUrl("/api/akun/all"))
      .then((res) => res.json())
      .then((data) => {
        const products = (data.data || []).map((item, index) => ({
          id: item.id || index + 1,
          nama: item.nama,
          rank: item.rank || "Unknown",
          description: `${item.heroes || 0} Heroes | ${item.skins || 0} Skins`,
          harga_rupiah: item.harga_rupiah || 0,
          harga_ringgit: item.harga_ringgit || 0,
          harga_dolar: item.harga_dolar || 0,
          discount: item.diskon + "%" || "0%",
          heroes: item.heroes || 0,
          skins: item.skins || 0,
          highlight: item.highlight,
          image:
            item.produkimg[0]?.link || "https://via.placeholder.com/300x400",
          gradient: getRandomGradient(),
        }));
        setAllProducts(products);
        setOriginalProducts(products);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setAllProducts([]);
        setOriginalProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  // logic flash sale
  useEffect(() => {
    let timeout;

    fetch(getApiUrl("/api/flash-sale"))
      .then((res) => {
        if (!res.ok) throw new Error("no flash sale");
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

        const active = now >= start && now <= end;
        setIsFlashSaleActive(active);

        if (active) {
          timeout = setTimeout(() => {
            setIsFlashSaleActive(false);
          }, end.getTime() - now.getTime());
        }
      })
      .catch(() => setIsFlashSaleActive(false));

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (initialSearch) {
      const parts = initialSearch.split(" - ").map((v) => v.trim());
      const hero = parts[0] || "";
      const skin = parts[1] || "";

      fetchByHeroSkin(hero, skin);
    }
  }, [initialSearch]);

  const handleFilterChange = () => setCurrentPage(1);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const filteredProducts = allProducts.filter((product) => {
    const price =
      lang === "id"
        ? product.harga_rupiah
        : lang === "ms"
          ? product.harga_ringgit
          : product.harga_dolar;

    const matchesPrice = price >= minPrice && price <= maxPrice;

    const matchesSearch =
      product.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.rank.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPrice && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // untuk search
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  let searchTimeout;

  const handleSearch = (key) => {
    if (!key.trim()) {
      setResults([]); // hide results
      setLoading(false);
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setLoading(true);

      fetch(getApiUrl(`/api/search/${key}`))
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.data.map((item) => item.search);
          setResults(mapped);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 500);
  };

  const fetchByHeroSkin = (hero, skin) => {
    setLoading(true);

    const url = getApiUrl(
      `/api/akun?hero=${encodeURIComponent(hero)}&skin=${encodeURIComponent(
        skin
      )}`
    );

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const products = (data.data || []).map((item, index) => ({
          id: item.id || index + 1,
          nama: item.nama,
          rank: item.rank || "Unknown",
          description: `${item.heroes || 0} Heroes | ${item.skins || 0} Skins`,
          harga_rupiah: item.harga_rupiah || 0,
          harga_ringgit: item.harga_ringgit || 0,
          harga_dolar: item.harga_dolar || 0,
          discount: item.diskon + "%" || "0%",
          heroes: item.heroes || 0,
          skins: item.skins || 0,
          image:
            item.produkimg[0]?.link || "https://via.placeholder.com/300x400",
          gradient: getRandomGradient(),
        }));
        setAllProducts(products);
        setCurrentPage(1);
        setIsSearchActive(true);
      })
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(item);
    setResults([]);

    const parts = item.split(" - ").map((v) => v.trim());
    const hero = parts[0] || "";
    const skin = parts[1] || "";

    fetchByHeroSkin(hero, skin);
  };

  return (
    <section className="relative min-h-screen py-20 pt-8 overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
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
        <div className="text-center mb-12">
          <h1 className="text-white mb-4">{t("products_title")}</h1>
          <p className="text-blue-200 max-w-2xl mx-auto">{t("browse")}</p>
        </div>

        <div className="mb-8 space-y-6">
          <div className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder={t("src")}
              value={query}
              onChange={(e) => {
                const val = e.target.value;
                setQuery(val);

                if (val.trim() === "") {
                  setResults([]);
                  setLoading(false);
                  return;
                }

                clearTimeout(window.searchDelay);
                window.searchDelay = setTimeout(() => {
                  handleSearch(val);
                }, 400);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!query.trim()) return;

                  const parts = query.split("-").map((p) => p.trim());
                  const hero = parts[0] || "";
                  const skin = parts[1] || "";

                  fetchByHeroSkin(hero, skin);
                }
              }}
              className="pl-4 h-12 bg-slate-800/90 backdrop-blur-xl border-slate-700/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 transition-all shadow-lg"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse" />
            </div>

            {query.trim() !== "" && (loading || results.length > 0) && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                {loading ? (
                  <div className="text-center py-2 text-sm text-gray-500 animate-pulse">
                    Loading...
                  </div>
                ) : results.length > 0 ? (
                  results.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No Result
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Filter className="h-5 w-5 text-blue-400" />
              <h3 className="text-white">{t("price_range")}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Price Range Dinamis */}
              <div className="space-y-2 w-full">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder={t("min_price")}
                    value={minPrice === 0 ? "" : minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded bg-slate-700 text-white"
                  />
                  <span className="text-white">-</span>
                  <input
                    type="number"
                    placeholder={t("max_price")}
                    value={maxPrice === Infinity ? "" : maxPrice}
                    onChange={(e) =>
                      setMaxPrice(Number(e.target.value) || Infinity)
                    }
                    className="w-full px-2 py-1 rounded bg-slate-700 text-white"
                  />
                </div>
              </div>
            </div>
            {isSearchActive && (
              <div className="w-full my-3">
                <Button
                  size="sm"
                  onClick={() => {
                    window.location.href = "/product";
                  }}
                  className="w-full"
                >
                  {t("reset")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-sm text-blue-300">
            {t("products_showing", {
              current: displayedProducts.length,
              total: filteredProducts.length,
            })}
          </p>
        </div>

        {loadingProducts ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-blue-200 text-sm">{t("loading")}</p>
            </div>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 ${gridView === "4" ? "lg:grid-cols-4" : "md:grid-cols-6"
              } gap-4 mb-12`}
          >
            {displayedProducts.map((product) => (
              <div key={product.id} className="relative group h-full">
                {/* CARD UTAMA */}
                <div className="relative flex flex-col h-full bg-[#007aff] rounded-lg sm:rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 z-20">
                    {isFlashSaleActive && product.highlight == 1 ? (
                      <img
                        src="/assets/images/flash.png"
                        alt="Flash Sale"
                        className="h-16 md:h-30 w-auto drop-shadow-xl animate-pulse"
                      />
                    ) : (
                      <div className="bg-[#FF0000] text-yellow-300 font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-bl-[15px] sm:rounded-bl-[25px] rounded-tr-[12px] sm:rounded-tr-[20px] shadow-lg border-b border-l sm:border-b-2 sm:border-l-2 border-white/20 skew-x-[-5deg]">
                        DISKON {product.discount}
                      </div>
                    )}
                  </div>

                  {/* IMAGE */}
                  <div className="flex-grow relative min-h-[120px] sm:min-h-[140px] md:min-h-[180px]">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* INFO */}
                  <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-1.5 sm:pt-2 relative z-10">
                    {/* TITLE */}
                    <h3 className="text-white font-black text-xs xs:text-sm sm:text-base md:text-xl italic uppercase leading-tight tracking-wide drop-shadow-md line-clamp-1 mb-1">
                      {product.nama}
                    </h3>

                    {/* PRICE + LOGO */}
                    <div className="flex justify-between items-end mb-2 sm:mb-3 gap-1">
                      <div className="flex flex-col flex-1 min-w-0">
                        {/* HARGA CORET */}
                        <div className="relative w-fit mb-0.5">
                          <span className="text-white/60 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold italic whitespace-nowrap">
                            {lang === "id"
                              ? `Rp.${product.harga_rupiah.toLocaleString()}`
                              : lang === "ms"
                                ? `RM${product.harga_ringgit.toLocaleString()}`
                                : `$${product.harga_dolar.toLocaleString()}`}
                          </span>
                          <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-red-600 -rotate-2" />
                        </div>

                        {/* HARGA AKHIR */}
                        <div className="text-white font-black text-xs xs:text-sm sm:text-base md:text-2xl italic leading-none tracking-tight">
                          {lang === "id"
                            ? `Rp.${Math.round(
                              (product.harga_rupiah *
                                (100 - parseInt(product.discount))) /
                              100
                            ).toLocaleString()}`
                            : lang === "ms"
                              ? `RM${Math.round(
                                (product.harga_ringgit *
                                  (100 - parseInt(product.discount))) /
                                100
                              ).toLocaleString()}`
                              : `$${Math.round(
                                (product.harga_dolar *
                                  (100 - parseInt(product.discount))) /
                                100
                              ).toLocaleString()}`}
                        </div>
                      </div>
                    </div>

                    {/* BUTTON */}
                    <a href={`/preview/${product.id}`} className="block w-full">
                      <Button
                        className={`w-full bg-gradient-to-r ${product.gradient} text-white font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-base py-2 sm:py-3 md:py-5 rounded-lg sm:rounded-xl hover:translate-y-[2px] transition-all border-none uppercase tracking-wider`}
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1" />
                        {t("buy")}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingProducts && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent className="bg-slate-800/90 backdrop-blur-xl rounded-lg border border-slate-700/50 p-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50 text-gray-400"
                        : "text-white hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer"
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNumber)}
                          isActive={currentPage === pageNumber}
                          className={
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 border-0"
                              : "text-gray-300 hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer"
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <span className="text-gray-500 px-2">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50 text-gray-400"
                        : "text-white hover:bg-blue-600/20 hover:text-blue-400 cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {!loadingProducts && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/90 backdrop-blur-xl rounded-full mb-6 border border-slate-700/50">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-white mb-2">{t("products_empty_title")}</h3>
            <p className="text-gray-400">{t("products_empty_desc")}</p>
          </div>
        )}
      </div>
    </section>
  );
}
