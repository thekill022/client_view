import { useState, useEffect } from "react";
import { Search, Menu, Globe, Check, X } from "lucide-react";
import { GoHomeFill } from "react-icons/go";
import { FiGrid } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
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
import { replace, useLocation } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import { MdSell } from "react-icons/md";
export default function Navbar({ currentPage, onNavigate, languange }) {
  const [selectedLanguage, setSelectedLanguage] = useState("ms");
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const { t, i18n } = useTranslation("common");
  const route = useLocation();

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

  return (
    <nav
      id="translate-root"
      className="sticky top-0 z-9999 bg-[#09052b] backdrop-blur-md border-b border-gray-800 shadow-sm"
    >
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex lg:hidden w-full items-center gap-2">
            <div className="flex items-center pl-2">
              <img
                src="/assets/images/merzz-icon.png"
                alt="Merz Store Logo"
                className="h-7 w-7 md:h-10 md:w-10 object-contain"
              />
              <img
                src="/assets/images/merzz-text.png"
                alt="Merz Store text Logo"
                className="h-30 w-30 md:h-43 md:w-47 object-contain"
              />
            </div>

            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("src")}
                className="bg-[#383966] text-white rounded-full h-9 text-sm py-0 placeholder:text-white"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobileMenu(!openMobileMenu)}
              className="text-white"
            >
              {openMobileMenu ? (
                <X className="size-8" />
              ) : (
                <Menu className="size-8" />
              )}
            </Button>
          </div>

          {openMobileMenu && (
            <div className="lg:hidden absolute top-16 left-0 w-full bg-[#09052b] border-t border-gray-800 p-4 space-y-4">
              <a
                href="https://wa.me/601128011202"
                className="flex items-center gap-2 text-white"
              >
                <FaClipboardList />
                <div>JUAL AKUN</div>
              </a>

              <div className="border-t border-gray-700 pt-3">
                {languages.map((language) => (
                  <div
                    key={language.code}
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      localStorage.setItem("lang", language.code);
                      languange(language.code);
                      i18n.changeLanguage(language.code);
                    }}
                    className="flex justify-between items-center text-white py-2"
                  >
                    <span>
                      {language.flag} {language.name}
                    </span>
                    {selectedLanguage === language.code && <Check size={16} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hidden lg:flex w-full items-center justify-between">
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

            <div className="flex justify-evenly px-2 mx-2 gap-5">
              <a
                href="/"
                className={`flex justify-center gap-2 items-center ${
                  route.pathname === "/" ? "text-blue-600" : "text-white"
                }`}
              >
                <GoHomeFill
                  className={` ${
                    route.pathname === "/" ? "fill-blue-600" : "fill-white"
                  } text-sm`}
                />
                <div className="text-sm">BERANDA</div>
              </a>
              <div className="flex justify-center gap-2 items-center text-white">
                <FiGrid className="fill-white text-sm rotate-45" />
                <div className="text-sm">TOPUP</div>
              </div>
              <a
                href="/product"
                className={`flex justify-center gap-2 items-center ${
                  route.pathname === "/product" ? "text-blue-600" : "text-white"
                }`}
              >
                <FiFolder
                  className={`${
                    route.pathname === "/product"
                      ? "fill-blue-600"
                      : "fill-white"
                  } text-sm`}
                />
                <div className="text-sm">BELI AKUN</div>
              </a>
              <div className="flex justify-center gap-2 items-center text-white">
                <svg
                  width="253"
                  height="254"
                  viewBox="0 0 253 254"
                  stroke="currentColor"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-white text-white h-4 w-4"
                >
                  <path
                    d="M55.5 132.09V184.09L126.5 148.09L196.5 183.09V132.59L126.5 92.5899L55.5 132.09Z"
                    fill="white"
                    stroke="currentColor"
                  />
                  <path
                    d="M55.5 200.59V252.59L126.5 216.59L196.5 251.59V201.09L126.5 161.09L55.5 200.59Z"
                    fill="white"
                    stroke="currentColor"
                  />
                  <path
                    d="M0.5 80.5899V146.59L126 73.5899L252 149.09V78.0899L125.5 0.58992L0.5 80.5899Z"
                    fill="white"
                    stroke="currentColor"
                  />
                </svg>
                <div className="text-sm">JOKI</div>
              </div>
              <div className="flex justify-center gap-2 items-center text-white">
                <FiMessageCircle className="fill-white text-sm" />
                <div className="text-sm">CHAT CS</div>
              </div>
              <div className="flex justify-center gap-2 items-center text-white">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex gap-2 items-center cursor-pointer">
                      <FaClipboardList className="fill-white text-sm" />
                      <div className="text-sm">LAINNYA</div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    sideOffset={6}
                    className="bg-gray-800 text-white shadow-lg rounded-md mt-3"
                  >
                    <div className="flex gap-2 items-center cursor-pointer p-2">
                      <MdSell className="text-white" />
                      <div>JUAL AKUN</div>
                    </div>
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="text-white w-full">
                            <div className="flex gap-2 w-full items-start">
                              <Globe className="h-5 w-5 text-white" />
                              <div>BAHASA</div>
                            </div>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex flex-1 max-w-full md:max-w-md">
              <div className="relative w-full group">
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
                  placeholder={t("src")}
                  className="pl-3 bg-[#383966] transition-all duration-300 gaming-text text-white placeholder:text-white rounded-full"
                />

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

                    {!loading &&
                      query.trim() !== "" &&
                      results.length === 0 && (
                        <div className="px-3 py-2 text-gray-700 text-sm">
                          {t("no_result")}
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
