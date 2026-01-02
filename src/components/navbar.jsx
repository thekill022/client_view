import { useState, useEffect } from "react";
import { Search, Menu, Globe, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getApiUrl } from "../config/api";
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

      fetch(getApiUrl(`/api/search/${key}`))
        .then((res) => res.json())
        .then((data) => {
          if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
          }

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
      className="sticky top-0 z-9999 bg-[#09052b] backdrop-blur-md border-b border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <img
                src="/assets/images/merzz-icon.png"
                alt="Merz Store Logo"
                className="h-7 w-7 md:h-10 md:w-10 object-contain"
              />
              <img
                src="/assets/images/merzz-text.png"
                alt="Merz Store text Logo"
                className="h-25 w-25 md:h-37 md:w-37 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-1 mx-2 sm:mx-4 md:mx-8 max-w-full md:max-w-md">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <Input
                type="search"
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);

                  if (val.trim() === "") {
                    clearTimeout(window.searchDelay);
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
                <div
                  className="
                  absolute top-full left-0 w-full mt-1
                  bg-white border border-gray-200 rounded-md shadow-lg z-50 p-2
                  max-h-60 sm:max-h-72
                  overflow-y-auto
                "
                >
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

          <div className="flex items-center relative">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
