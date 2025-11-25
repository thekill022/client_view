import { useState, useEffect } from "react";
import { Search, Menu, Globe, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { replace } from "react-router-dom";

const searchPlaceholders = [
  "Chou - Kung Fu Boy",
  "Fanny - Blade Dancer",
  "Gusion - Holy Blade",
  "Alucard - Fiery Inferno",
  "Ling - Street Punk",
  "Benedetta - Shadow Ranger",
  "Hayabusa - Sushi Master",
  "Lancelot - Royal Matador",
  "Granger - Doomsday",
  "Harley - Magical Star",
];

export default function Navbar({ currentPage, onNavigate, languange }) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("ms");
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation("common");

  // ini untuk searching
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  let searchTimeout;

  const handleSearch = (key) => {
    if (!key.trim()) return setResults([]);

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

  const languages = [
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "ms", name: "Malay", flag: "🇲🇾" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setSelectedLanguage(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const currentPlaceholder = searchPlaceholders[placeholderIndex];
    const typingSpeed = isDeleting ? 30 : 80;
    const pauseEnd = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentPlaceholder.length) {
        setDisplayText(currentPlaceholder.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentPlaceholder.length) {
        setTimeout(() => setIsDeleting(true), pauseEnd);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(currentPlaceholder.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setPlaceholderIndex(
          (prevIndex) => (prevIndex + 1) % searchPlaceholders.length
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, placeholderIndex]);

  return (
    <nav
      id="translate-root"
      className="sticky top-0 z-9999 bg-gray-800/95 backdrop-blur-md border-b border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img
                src="/assets/merz-gif.gif"
                alt="Merz Store Logo"
                className="h-15 w-15 md:h-20 md:w-30 object-contain"
              />
            </div>

            <div className="hidden md:block ml-10">
              <div className="flex items-baseline gap-4">
                <button
                  onClick={() => onNavigate("/")}
                  className={`gaming-text px-3 py-2 rounded-md transition-all duration-300 relative group ${
                    currentPage === "/"
                      ? "text-blue-600"
                      : "text-white hover:text-blue-600"
                  }`}
                >
                  {t("home")}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
                      currentPage === "/" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                <button
                  onClick={() => onNavigate("/product")}
                  className={`gaming-text px-3 py-2 rounded-md transition-all duration-300 relative group ${
                    currentPage === "/product"
                      ? "text-blue-600"
                      : "text-white hover:text-blue-600"
                  }`}
                >
                  {t("products")}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
                      currentPage === "/product"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
                <button
                  onClick={() => onNavigate("/rules")}
                  className={`gaming-text px-3 py-2 rounded-md transition-all duration-300 relative group ${
                    currentPage === "/rules"
                      ? "text-blue-600"
                      : "text-white hover:text-blue-600"
                  }`}
                >
                  {t("how")}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 ${
                      currentPage === "/rules"
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <Input
                type="search"
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
                placeholder={displayText}
                className="pl-10 bg-gray-800 border-gray-600 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 gaming-text text-white placeholder-gray-400"
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="inline-block w-0.5 h-4 bg-blue-500 animate-pulse" />
              </div>

              {(results.length > 0 ||
                loading ||
                (query.trim() !== "" && results.length === 0)) && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2">
                  {loading && (
                    <div className="text-center py-2 text-sm text-gray-500 animate-pulse">
                      {t("loading")}
                    </div>
                  )}

                  {!loading &&
                    results.length > 0 &&
                    results.map((item, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setResults([]);
                          setQuery(item);

                          window.location.href = `/product?search=${encodeURIComponent(
                            item
                          )}`;
                        }}
                      >
                        {item}
                      </div>
                    ))}

                  {!loading && query.trim() !== "" && results.length === 0 && (
                    <div className="px-3 py-2 text-gray-700 text-sm">
                      {t("no_result")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-800 transition-all duration-300 relative"
                >
                  <Globe className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={6}
                className="bg-gray-800 text-white shadow-lg rounded-md mt-3"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      localStorage.setItem("lang", language.code); // PATCH DI SINI
                      languange(language.code);
                      i18n.changeLanguage(language.code);
                    }}
                    className="flex items-center justify-between cursor-pointer focus:bg-blue-100 focus:text-black gaming-text"
                  >
                    <div className="flex items-center gap-2">
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                    {selectedLanguage === language.code && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </Button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden my-2 border-t border-gray-200 bg-gray-800 shadow-lg rounded-md p-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate("/")}
                className={`text-left px-3 py-2 rounded-md transition-all duration-300 ${
                  currentPage === "/"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate("/product")}
                className={`text-left px-3 py-2 rounded-md transition-all duration-300 ${
                  currentPage === "/product"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => onNavigate("/rules")}
                className={`text-left px-3 py-2 rounded-md transition-all duration-300 ${
                  currentPage === "/rules"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                How To Buy?
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
