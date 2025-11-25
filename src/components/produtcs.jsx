import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, Star, Filter, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
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
    fetch("http://localhost:3000/api/akun/all")
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
        setOriginalProducts(products);
      })
      .catch((err) => {
        console.error("Failed to load products", err);
        setAllProducts([]);
        setOriginalProducts([]);
      })
      .finally(() => setLoadingProducts(false));
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
        : lang === "my"
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

      fetch(`http://localhost:3000/api/search/${key}`)
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

    const url = `http://localhost:3000/api/akun?hero=${encodeURIComponent(
      hero
    )}&skin=${encodeURIComponent(skin)}`;

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
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
      </div>
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
              className="pl-12 h-12 bg-slate-800/90 backdrop-blur-xl border-slate-700/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 transition-all shadow-lg"
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
            className={`grid grid-cols-2 ${
              gridView === "4" ? "md:grid-cols-4" : "md:grid-cols-6"
            } gap-4 mb-12`}
          >
            {displayedProducts.map((product) => (
            <div key={product.id} className="group relative">
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
                      className={`bg-gradient-to-r ${product.gradient} border-0 shadow-lg backdrop-blur-sm text-xs`}
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
                          ? `Rp ${product.harga_rupiah?.toLocaleString() || 0}`
                          : lang === "my"
                          ? `RM ${product.harga_ringgit?.toLocaleString() || 0}`
                          : `$${product.harga_dolar?.toLocaleString() || 0}`}
                      </p>
                    </div>
                    <a href={"/preview/" + product.id}>
                      <Button
                        size="sm"
                        onClick={onProductClick}
                        className={`w-full bg-gradient-to-r ${product.gradient} hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 border-0 group-hover:scale-105 text-xs`}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {t("view")}
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
