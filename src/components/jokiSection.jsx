import { useState, useEffect } from "react";
import { getApiUrl } from "../config/api";
import { useTranslation } from "react-i18next";
import { WhyChoose } from "./whyChoose";
import {
  Shield,
  Calculator,
  Package,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Drawer, Button as Btn, Typography } from "@material-tailwind/react";
import {
  FaInstagram,
  FaUserFriends,
  FaBullhorn,
  FaQuestionCircle,
  FaTag,
  FaShoppingCart,
  FaCreditCard,
  FaTimes,
} from "react-icons/fa";

// Helper untuk mendapatkan info rank Mythical berdasarkan jumlah bintang
const getMythicalRankByStars = (stars) => {
  const starCount = parseInt(stars) || 0;
  if (starCount >= 1 && starCount <= 25) {
    return {
      id: "mythic",
      name: "Mythical Romawi",
      tier: "Mythical Romawi",
      stars: 25,
      min: 1,
      max: 25,
    };
  } else if (starCount >= 26 && starCount <= 50) {
    return {
      id: "honor",
      name: "Mythical Honor",
      tier: "Mythical Honor",
      stars: 25,
      min: 26,
      max: 50,
    };
  } else if (starCount >= 51 && starCount <= 100) {
    return {
      id: "glory",
      name: "Mythical Glory",
      tier: "Mythical Glory",
      stars: 50,
      min: 51,
      max: 100,
    };
  } else if (starCount >= 101 && starCount <= 5000) {
    return {
      id: "immortal",
      name: "Mythical Immortal",
      tier: "Mythical Immortal",
      stars: 4900,
      min: 101,
      max: 5000,
    };
  }
  return null;
};

// Helper untuk mendapatkan range bintang yang valid
const getValidStarRange = (rankId) => {
  switch (rankId) {
    case "mythic":
      return { min: 1, max: 25, label: "1 - 25" };
    case "honor":
      return { min: 26, max: 50, label: "26 - 50" };
    case "glory":
      return { min: 51, max: 100, label: "51 - 100" };
    case "immortal":
      return { min: 101, max: 5000, label: "101 - 5000" };
    default:
      const rank = MANUAL_RANKS.find((r) => r.id === rankId);
      return rank
        ? { min: 0, max: rank.stars, label: `0 - ${rank.stars}` }
        : { min: 0, max: 0, label: "0" };
  }
};

const MANUAL_RANKS = [
  { id: "m4", name: "Master IV", tier: "Master", stars: 4 },
  { id: "m3", name: "Master III", tier: "Master", stars: 4 },
  { id: "m2", name: "Master II", tier: "Master", stars: 4 },
  { id: "m1", name: "Master I", tier: "Master", stars: 4 },
  { id: "gm5", name: "Grandmaster V", tier: "Grandmaster", stars: 5 },
  { id: "gm4", name: "Grandmaster IV", tier: "Grandmaster", stars: 5 },
  { id: "gm3", name: "Grandmaster III", tier: "Grandmaster", stars: 5 },
  { id: "gm2", name: "Grandmaster II", tier: "Grandmaster", stars: 5 },
  { id: "gm1", name: "Grandmaster I", tier: "Grandmaster", stars: 5 },
  { id: "e5", name: "Epic V", tier: "Epic", stars: 5 },
  { id: "e4", name: "Epic IV", tier: "Epic", stars: 5 },
  { id: "e3", name: "Epic III", tier: "Epic", stars: 5 },
  { id: "e2", name: "Epic II", tier: "Epic", stars: 5 },
  { id: "e1", name: "Epic I", tier: "Epic", stars: 5 },
  { id: "l5", name: "Legend V", tier: "Legend", stars: 5 },
  { id: "l4", name: "Legend IV", tier: "Legend", stars: 5 },
  { id: "l3", name: "Legend III", tier: "Legend", stars: 5 },
  { id: "l2", name: "Legend II", tier: "Legend", stars: 5 },
  { id: "l1", name: "Legend I", tier: "Legend", stars: 5 },
  // Mythical ranks dengan ID terpisah
  {
    id: "mythic",
    name: "Mythical Romawi",
    tier: "Mythical Romawi",
    stars: 25,
    isMythical: true,
    minStars: 1,
    maxStars: 25,
  },
  {
    id: "honor",
    name: "Mythical Honor",
    tier: "Mythical Honor",
    stars: 25,
    isMythical: true,
    minStars: 26,
    maxStars: 50,
  },
  {
    id: "glory",
    name: "Mythical Glory",
    tier: "Mythical Glory",
    stars: 50,
    isMythical: true,
    minStars: 51,
    maxStars: 100,
  },
  {
    id: "immortal",
    name: "Mythical Immortal",
    tier: "Mythical Immortal",
    stars: 4900,
    isMythical: true,
    minStars: 101,
    maxStars: 5000,
  },
];

export function JokiSection({ lang }) {
  const { t } = useTranslation("common");
  const [ranks, setRanks] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculator states
  const [startRank, setStartRank] = useState("");
  const [targetRank, setTargetRank] = useState("");
  const [startStars, setStartStars] = useState("");
  const [targetStars, setTargetStars] = useState("");
  const [startStarError, setStartStarError] = useState("");
  const [targetStarError, setTargetStarError] = useState("");
  const [jokiType, setJokiType] = useState("reguler");
  const [totalStarsDiff, setTotalStarsDiff] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showPrice, setShowPrice] = useState(false);

  // Survey drawer states
  const [openSurveyDrawer, setOpenSurveyDrawer] = useState(false);
  const [source, setSource] = useState("");
  const [otherSource, setOtherSource] = useState("");
  const [pendingOrderData, setPendingOrderData] = useState(null);

  const isSurveyValid =
    source && (source !== "lain" || otherSource.trim() !== "");

  const selectSource = (value) => {
    setSource(value);
    if (value !== "lain") {
      setOtherSource("");
    }
  };

  const submitSurvey = async () => {
    const keterangan = source === "lain" ? otherSource.trim() : source;
    await fetch(getApiUrl("/api/survei"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keterangan: keterangan,
      }),
    });
  };

  const openSurveyDrawerForOrder = (orderData) => {
    setPendingOrderData(orderData);
    setOpenSurveyDrawer(true);
  };

  const closeSurveyDrawer = () => {
    setOpenSurveyDrawer(false);
    setSource("");
    setOtherSource("");
    setPendingOrderData(null);
  };

  const handleOrderWithSurvey = async () => {
    try {
      await submitSurvey();
    } catch (e) {
      console.error("Survey submission error:", e);
    }
    closeSurveyDrawer();
    if (pendingOrderData?.message) {
      window.open(
        `https://api.whatsapp.com/send?phone=601164498139&text=${encodeURIComponent(pendingOrderData.message)}`,
        "_self",
      );
    }
  };

  // Effect untuk lock body scroll saat drawer terbuka
  useEffect(() => {
    if (openSurveyDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [openSurveyDrawer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ranksRes, pkgsRes] = await Promise.all([
          fetch(getApiUrl("/api/joki/ranks")),
          fetch(getApiUrl("/api/joki/packages")),
        ]);
        const ranksData = await ranksRes.json();
        const pkgsData = await pkgsRes.json();

        setRanks(ranksData);
        setPackages(pkgsData);
      } catch (err) {
        console.error("Failed to fetch joki data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Validasi input bintang
  const validateStars = (value, rankId, isStart) => {
    if (!rankId || value === "") {
      isStart ? setStartStarError("") : setTargetStarError("");
      return;
    }

    const numValue = parseInt(value);
    const range = getValidStarRange(rankId);

    if (isNaN(numValue)) {
      const error = `Masukkan angka valid (${range.label})`;
      isStart ? setStartStarError(error) : setTargetStarError(error);
      return;
    }

    if (numValue < range.min || numValue > range.max) {
      const error = `Bintang ${
        rankId === "mythic"
          ? "Mythical Romawi"
          : rankId === "honor"
            ? "Mythical Honor"
            : rankId === "glory"
              ? "Mythical Glory"
              : rankId === "immortal"
                ? "Mythical Immortal"
                : MANUAL_RANKS.find((r) => r.id === rankId)?.name
      } adalah ${range.label}`;
      isStart ? setStartStarError(error) : setTargetStarError(error);
    } else {
      isStart ? setStartStarError("") : setTargetStarError("");
    }
  };

  const handleStartStarsChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan angka
    if (value !== "" && !/^\d+$/.test(value)) return;

    setStartStars(value);
    validateStars(value, startRank, true);
  };

  const handleTargetStarsChange = (e) => {
    const value = e.target.value;
    // Hanya izinkan angka
    if (value !== "" && !/^\d+$/.test(value)) return;

    setTargetStars(value);
    validateStars(value, targetRank, false);
  };

  useEffect(() => {
    calculatePrice();
    setShowPrice(false);
  }, [startRank, targetRank, startStars, targetStars, lang, ranks, jokiType]);

  const calculatePrice = () => {
    if (!startRank || !targetRank || ranks.length === 0) return;

    const startNum = parseInt(startStars) || 0;
    const targetNum = parseInt(targetStars) || 0;

    const sIdx = MANUAL_RANKS.findIndex((r) => r.id === startRank);
    const tIdx = MANUAL_RANKS.findIndex((r) => r.id === targetRank);

    if (tIdx < sIdx || (tIdx === sIdx && targetNum <= startNum)) {
      setTotalPrice(0);
      setTotalStarsDiff(0);
      return;
    }

    let price = 0;
    let totalStars = 0;
    const currencyField =
      lang === "id"
        ? "harga_rupiah"
        : lang === "ms"
          ? "harga_ringgit"
          : "harga_dolar";

    for (let i = sIdx; i <= tIdx; i++) {
      const mRank = MANUAL_RANKS[i];
      const dbRank = ranks.find((r) => r.nama === mRank.tier);
      const rankPrice = dbRank?.joki_per_star?.[0]?.[currencyField] || 0;

      if (i === sIdx && i === tIdx) {
        // Same rank
        const stars = Math.max(0, targetNum - startNum);
        price += stars * rankPrice;
        totalStars += stars;
      } else if (i === sIdx) {
        // First rank
        const range = getValidStarRange(mRank.id);
        const starsLeft = Math.max(0, range.max - startNum + 1);
        price += starsLeft * rankPrice;
        totalStars += starsLeft;
      } else if (i === tIdx) {
        // Last rank
        const range = getValidStarRange(mRank.id);
        const starsInTarget = targetNum - range.min + 1;
        price += Math.max(0, starsInTarget) * rankPrice;
        totalStars += Math.max(0, starsInTarget);
      } else {
        // Middle ranks
        const range = getValidStarRange(mRank.id);
        const starsInRank = range.max - range.min + 1;
        price += starsInRank * rankPrice;
        totalStars += starsInRank;
      }
    }

    if (jokiType === "express") {
      let surchargePerStar = 1000;
      if (lang === "ms") {
        surchargePerStar = 0.3;
      } else if (lang === "en") {
        surchargePerStar = 0.07;
      }
      price += totalStars * surchargePerStar;
    }

    setTotalPrice(price);
    setTotalStarsDiff(totalStars);
  };

  const formatCurrency = (val) => {
    if (lang === "id") return `Rp ${val.toLocaleString("id-ID")}`;
    if (lang === "ms") return `RM ${val.toLocaleString("en-MY")}`;
    return `$${val.toLocaleString("en-US")}`;
  };

  const buildOrderMessage = (type, details) => {
    if (type === "joki") {
      const {
        jokiType,
        startName,
        startStars,
        targetName,
        targetStars,
        price,
      } = details;
      return t("joki.order_message_joki", {
        type: jokiType.toUpperCase(),
        startName,
        startStars,
        targetName,
        targetStars,
        price: formatCurrency(price),
      });
    }

    if (type === "package") {
      const { packageName, price } = details;
      return t("joki.order_message_package", {
        packageName,
        price: formatCurrency(price),
      });
    }

    return "";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const getStarPlaceholder = (rankId) => {
    const range = getValidStarRange(rankId);
    return range.label;
  };

  return (
    <section className="py-30 pt-4 scroll-smooth">
      <div className="mx-auto">
        <div className="w-full mx-auto py-10 space-y-16 px-4 sm:px-6 lg:px-8 scroll-smooth">
          <WhyChoose classname="pb-10" />

          {/* Navigation Tabs Section */}
          {(() => {
            const tabs = [
              { id: "daftar", text: "Daftar Harga" },
              { id: "kalkulator", text: "Kalkulator Joki" },
              { id: "hemat", text: "Joki Hemat" },
            ];
            return (
              <>
                <div className="flex items-center justify-center drop-shadow-[0_0_10px_rgba(0,191,255,0.3)] z-10">
                  {tabs.map((tab, index) => {
                    const isFirst = index === 0;
                    const isLast = index === tabs.length - 1;
                    return (
                      <div
                        key={tab.id}
                        className={`relative flex items-center ${
                          !isFirst ? "-ml-[2px]" : ""
                        }`}
                      >
                        <a href={`#${tab.id}`}>
                          <button
                            className={`
                  relative z-10
                  flex items-center justify-center
                  w-[125px] h-[40px] md:w-[180px] md:h-[50px]
                  transition-all duration-300 ease-in-out
                  rounded-full border border-[#00bfff]
                  bg-[#1541a0] hover:bg-[#1a4dbd] hover:z-20 hover:shadow-[0_0_10px_rgba(0,191,255,0.4)]
                `}
                          >
                            <span className="text-[11px] md:text-sm font-bold text-white tracking-wider whitespace-nowrap">
                              {tab.text}
                            </span>
                          </button>
                        </a>

                        {!isLast && (
                          <div className="absolute right-0 translate-x-1/2 z-30 pointer-events-none flex items-center justify-center">
                            <div className="w-3.5 h-3.5 md:w-5 md:h-5 bg-[#00bfff] rotate-45 shadow-[0_0_5px_#00bfff]"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}

          {/* Ranks Table Style */}
          <section
            id="daftar"
            className="scroll-mt-20 w-full mx-auto overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="bg-[#0190FF] py-6 px-10 flex justify-between items-center border-b-[6px] border-[#0070c8]">
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white/90 drop-shadow"></div>
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">
                {t("joki.price_list")}
              </h2>
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-white/90 drop-shadow"></div>
            </div>

            <div className="bg-white p-3 md:p-10">
              <div className="grid grid-cols-2 gap-2 md:gap-6">
                {ranks.map((rank) => (
                  <div
                    key={rank.id}
                    className="bg-gradient-to-r from-[#0066cc] to-[#3399ff] rounded-lg md:rounded-2xl px-2 md:px-5 py-2 md:py-3 flex items-center gap-2 md:gap-4 shadow-[0_4px_0_rgba(0,50,150,0.3)] hover:scale-[1.03] transition-all cursor-default"
                  >
                    <div className="w-8 h-8 md:w-12 md:h-12 flex-shrink-0 bg-white/10 rounded-lg p-0.5 md:p-1">
                      <img
                        src={import.meta.env.VITE_IMG_URL + rank.image}
                        alt={rank.nama}
                        className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                    <div className="flex flex-col leading-none min-w-0 flex-1">
                      <span className="text-white font-black italic uppercase text-[9px] md:text-base tracking-[0.05em] mb-0.5 md:mb-1 truncate">
                        {rank.nama}
                      </span>
                      <span className="text-yellow-400 font-black text-xs md:text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        {formatCurrency(
                          rank.joki_per_star?.[0]?.[
                            lang === "id"
                              ? "harga_rupiah"
                              : lang === "ms"
                                ? "harga_ringgit"
                                : "harga_dolar"
                          ] || 0,
                        )}{" "}
                        <span className="text-[7px] md:text-xs">
                          / {t("joki.per_star")}
                        </span>
                      </span>
                      <span className="text-white/80 text-[7px] md:text-xs italic leading-tight mt-0.5">
                        {t("joki.express")} +
                        {(() => {
                          let regular =
                            rank.joki_per_star?.[0]?.[
                              lang === "id"
                                ? "harga_rupiah"
                                : lang === "ms"
                                  ? "harga_ringgit"
                                  : "harga_dolar"
                            ] || 0;
                          let surcharge = 1000;
                          if (lang === "ms") surcharge = 0.3;
                          else if (lang === "en") surcharge = 0.07;
                          return (
                            formatCurrency(regular + surcharge) +
                            " / " +
                            t("joki.per_star")
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Calculator Section */}
          <section
            id="kalkulator"
            className="scroll-mt-20 w-full mx-auto overflow-hidden rounded-3xl shadow-2xl relative z-10"
          >
            <div className="bg-[#0190FF] py-3 md:py-5 px-4 md:px-10 flex justify-between items-center border-b-[6px] border-[#0070c8]">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] md:border-t-[12px] border-t-white/90"></div>
              <h2 className="text-lg sm:text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg whitespace-nowrap px-2">
                {t("joki.calculator_title", {
                  defaultValue: "Kalkulator Joki Rangked",
                })}
              </h2>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] md:border-t-[12px] border-t-white/90"></div>
            </div>

            <div className="bg-white p-4 md:p-10 space-y-6 md:space-y-10">
              <div className="grid grid-cols-2 gap-4 md:gap-16">
                {/* Rank Saat Ini */}
                <div className="space-y-2 md:space-y-4">
                  <h3 className="text-center text-[#ff9900] font-black italic uppercase text-sm md:text-xl">
                    {t("joki.current_rank")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="space-y-1">
                      <label className="block text-center text-[#0066cc] font-black text-[10px] md:text-xs uppercase">
                        {t("joki.label_rank")}
                      </label>
                      <select
                        value={startRank}
                        onChange={(e) => {
                          setStartRank(e.target.value);
                          setStartStars("");
                          setStartStarError("");
                        }}
                        className="w-full bg-[#e2e8f0] text-gray-800 font-bold rounded-full px-2 md:px-4 py-2 md:py-3 border-none outline-none text-center appearance-none shadow-inner text-xs md:text-sm"
                      >
                        <option value="" disabled hidden>
                          {t("joki.select_rank_placeholder")}
                        </option>
                        {MANUAL_RANKS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-center text-[#0066cc] font-black text-[10px] md:text-xs uppercase">
                        {t("joki.label_stars")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={startStars}
                          onChange={handleStartStarsChange}
                          disabled={!startRank}
                          placeholder={
                            startRank ? getStarPlaceholder(startRank) : "-"
                          }
                          className={`w-full bg-[#e2e8f0] text-gray-800 font-bold rounded-full px-2 md:px-4 py-2 md:py-3 border-none outline-none text-center shadow-inner text-xs md:text-sm disabled:opacity-50 placeholder:text-gray-400 ${
                            startStarError ? "ring-2 ring-red-500" : ""
                          }`}
                        />
                      </div>
                      {startStarError && (
                        <div className="flex items-center gap-1 text-red-500 text-[9px] md:text-xs mt-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="leading-tight">
                            {startStarError}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rank Tujuan */}
                <div className="space-y-2 md:space-y-4">
                  <h3 className="text-center text-[#ff9900] font-black italic uppercase text-sm md:text-xl">
                    {t("joki.target_rank")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div className="space-y-1">
                      <label className="block text-center text-[#0066cc] font-black text-[10px] md:text-xs uppercase">
                        {t("joki.label_rank")}
                      </label>
                      <select
                        value={targetRank}
                        onChange={(e) => {
                          setTargetRank(e.target.value);
                          setTargetStars("");
                          setTargetStarError("");
                        }}
                        className="w-full bg-[#e2e8f0] text-gray-800 font-bold rounded-full px-2 md:px-4 py-2 md:py-3 border-none outline-none text-center appearance-none shadow-inner text-xs md:text-sm"
                      >
                        <option value="" disabled hidden>
                          {t("joki.select_rank_placeholder")}
                        </option>
                        {MANUAL_RANKS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-center text-[#0066cc] font-black text-[10px] md:text-xs uppercase">
                        {t("joki.label_stars")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={targetStars}
                          onChange={handleTargetStarsChange}
                          disabled={!targetRank}
                          placeholder={
                            targetRank ? getStarPlaceholder(targetRank) : "-"
                          }
                          className={`w-full bg-[#e2e8f0] text-gray-800 font-bold rounded-full px-2 md:px-4 py-2 md:py-3 border-none outline-none text-center shadow-inner text-xs md:text-sm disabled:opacity-50 placeholder:text-gray-400 ${
                            targetStarError ? "ring-2 ring-red-500" : ""
                          }`}
                        />
                      </div>
                      {targetStarError && (
                        <div className="flex items-center gap-1 text-red-500 text-[9px] md:text-xs mt-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="leading-tight">
                            {targetStarError}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Joki Type Selection */}
              <div className="flex justify-center gap-2 md:gap-4">
                <button
                  onClick={() => setJokiType("reguler")}
                  className={`flex-1 max-w-[150px] md:max-w-[200px] py-2 md:py-4 rounded-xl md:rounded-2xl font-black italic uppercase text-xs md:text-base transition-all shadow-md ${
                    jokiType === "reguler"
                      ? "bg-[#0190FF] text-white shadow-[#0070c8] scale-105 border-b-4 border-[#0070c8]"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {t("joki.regular")}
                </button>
                <button
                  onClick={() => setJokiType("express")}
                  className={`flex-1 max-w-[150px] md:max-w-[200px] py-2 md:py-4 rounded-xl md:rounded-2xl font-black italic uppercase text-xs md:text-base transition-all shadow-md ${
                    jokiType === "express"
                      ? "bg-[#0190FF] text-white shadow-[#0070c8] scale-105 border-b-4 border-[#0070c8]"
                      : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                  }`}
                >
                  {t("joki.express")}
                </button>
              </div>

              {/* Rank Visuals */}
              <div className="bg-gradient-to-b from-gray-200 to-gray-50 rounded-2xl md:rounded-[2.5rem] p-4 md:p-10 shadow-inner border-b-4 border-gray-300/50">
                <div className="flex items-center justify-around gap-2 md:gap-10">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-40 md:h-40 relative flex items-center justify-center">
                      {startRank && (
                        <div key={startRank} className="w-full h-full relative">
                          <img
                            src={
                              import.meta.env.VITE_IMG_URL +
                              ranks.find(
                                (r) =>
                                  r.nama ===
                                  MANUAL_RANKS.find((mr) => mr.id === startRank)
                                    ?.tier,
                              )?.image
                            }
                            alt="Start Rank"
                            className="w-full h-full object-contain filter drop-shadow-2xl animate-slide-in-left"
                          />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white text-[#0190FF] font-black text-xs md:text-2xl px-2 md:px-5 py-0.5 md:py-1 rounded-full shadow-2xl border-2 border-[#0190FF]">
                            {startStars || "-"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="text-[#0190FF] font-black text-2xl md:text-7xl italic animate-pulse tracking-tighter opacity-90 drop-shadow">
                      {">>>"}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-40 md:h-40 relative flex items-center justify-center">
                      {targetRank && (
                        <div
                          key={targetRank}
                          className="w-full h-full relative"
                        >
                          <img
                            src={
                              import.meta.env.VITE_IMG_URL +
                              ranks.find(
                                (r) =>
                                  r.nama ===
                                  MANUAL_RANKS.find(
                                    (mr) => mr.id === targetRank,
                                  )?.tier,
                              )?.image
                            }
                            alt="Target Rank"
                            className="w-full h-full object-contain filter drop-shadow-2xl animate-slide-in-right"
                          />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white text-[#0190FF] font-black text-xs md:text-2xl px-2 md:px-5 py-0.5 md:py-1 rounded-full shadow-2xl border-2 border-[#0190FF]">
                            {targetStars || "-"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Display */}
              <div className="text-center space-y-2 pt-2 md:pt-4 h-16 md:h-24 flex flex-col justify-center">
                {showPrice ? (
                  <>
                    <span className="text-gray-400 font-black uppercase text-xs md:text-sm tracking-widest">
                      {t("joki.estimate_total")}
                    </span>
                    <div className="text-[#0190FF] text-3xl md:text-7xl font-black drop-shadow-[0_2px_4px_rgba(1,144,255,0.2)] transition-all animate-in fade-in zoom-in duration-500">
                      {formatCurrency(totalPrice)}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-300 italic font-medium text-sm md:text-base animate-pulse">
                    {t("joki.click_to_view")}
                  </div>
                )}
                {totalStarsDiff < 5 && totalStarsDiff > 0 && (
                  <div className="text-red-500 text-xs md:text-sm font-black uppercase animate-bounce pt-2 border-t border-red-100 mt-2 md:mt-4 inline-block px-4">
                    {t("joki.min_order_warning")}
                  </div>
                )}
              </div>

              {/* Hitung / Order Button */}
              <div className="max-w-xs md:max-w-md mx-auto">
                <Button
                  onClick={() => {
                    if (totalStarsDiff < 5) return;
                    if (!showPrice) {
                      setShowPrice(true);
                    } else {
                      const msg = buildOrderMessage("joki", {
                        jokiType,
                        startName: MANUAL_RANKS.find((r) => r.id === startRank)
                          ?.name,
                        startStars,
                        targetName: MANUAL_RANKS.find(
                          (r) => r.id === targetRank,
                        )?.name,
                        targetStars,
                        price: totalPrice,
                      });
                      openSurveyDrawerForOrder({ message: msg });
                    }
                  }}
                  disabled={
                    totalStarsDiff < 5 || startStarError || targetStarError
                  }
                  className={`w-full hover:bg-[#007cdb] text-white font-black italic uppercase py-4 md:py-8 rounded-2xl md:rounded-3xl text-xl md:text-3xl shadow-[0_4px_0_#0070c8] md:shadow-[0_8px_0_#0070c8] active:translate-y-1 active:shadow-none transition-all disabled:grayscale disabled:opacity-50 ${
                    showPrice
                      ? "bg-green-500 shadow-[0_4px_0_#15803d] md:shadow-[0_8px_0_#15803d] hover:bg-green-600"
                      : "bg-[#0190FF]"
                  }`}
                >
                  {showPrice ? t("joki.order_now") : t("joki.calculate")}
                </Button>
              </div>
            </div>
          </section>

          {/* Joki Paket Section */}
          <section
            id="hemat"
            className="scroll-mt-20 w-full mx-auto overflow-hidden rounded-3xl shadow-2xl"
          >
            <div className="bg-[#0190FF] py-3 md:py-5 px-4 md:px-10 flex justify-between items-center border-b-[6px] border-[#0070c8]">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] md:border-t-[12px] border-t-white/90"></div>
              <h2 className="text-lg sm:text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg whitespace-nowrap px-2">
                {t("joki.packages_title")}
              </h2>
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] md:border-t-[12px] border-t-white/90"></div>
            </div>

            <div className="bg-white p-3 md:p-8 space-y-2 md:space-y-4">
              {packages.length > 0 ? (
                packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => {
                      const msg = buildOrderMessage("package", {
                        packageName: pkg.nama_paket,
                        price:
                          pkg[
                            lang === "id"
                              ? "harga_rupiah"
                              : lang === "ms"
                                ? "harga_ringgit"
                                : "harga_dolar"
                          ] || 0,
                      });
                      openSurveyDrawerForOrder({ message: msg });
                    }}
                    className="w-full bg-gradient-to-r from-[#0066cc] to-[#3399ff] rounded-xl md:rounded-2xl px-3 md:px-6 py-2 md:py-4 flex items-center gap-2 md:gap-4 shadow-[0_4px_0_rgba(0,50,150,0.3)] hover:scale-[1.02] transition-all cursor-pointer text-left group"
                  >
                    <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 bg-white/20 rounded-lg p-1 md:p-2">
                      <img
                        src={pkg.image || "https://via.placeholder.com/56x56  "}
                        alt={pkg.nama_paket}
                        className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-white font-black italic uppercase text-xs md:text-base tracking-[0.05em] mb-0.5 md:mb-1 line-clamp-2 leading-tight">
                        {pkg.nama_paket}
                      </div>
                      <div className="text-white/80 text-[10px] md:text-sm italic line-clamp-1 leading-tight">
                        {pkg.deskripsi}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-yellow-400 font-black text-sm md:text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform">
                        {formatCurrency(
                          pkg[
                            lang === "id"
                              ? "harga_rupiah"
                              : lang === "ms"
                                ? "harga_ringgit"
                                : "harga_dolar"
                          ] || 0,
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 md:py-12 text-gray-400">
                  <p className="font-semibold text-sm md:text-base">
                    {t("joki.no_packages")}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* CUSTOM SURVEY DRAWER - Menggunakan Fixed Positioning */}
          {openSurveyDrawer && (
            <>
              {/* Backdrop Overlay */}
              <div
                className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
                onClick={closeSurveyDrawer}
              />

              {/* Drawer Container - Fixed bottom dengan margin untuk bottom menu */}
              <div className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col max-h-[85vh]">
                {/* Drawer Content */}
                <div className="bg-gray-900 text-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                  {/* Handle indicator */}
                  <div className="w-full flex justify-center pt-2 pb-1">
                    <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-4 pb-20">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 py-2">
                      <div className="flex items-center gap-2">
                        <FaShoppingCart className="text-blue-500 text-xl" />
                        <Typography variant="h5" color="white">
                          {t("joki.drawer_shop_name")}
                        </Typography>
                      </div>
                      <button
                        onClick={closeSurveyDrawer}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <FaTimes className="text-white text-lg" />
                      </button>
                    </div>

                    {/* Survey Title */}
                    <Typography className="mb-6 font-medium text-white text-base">
                      {t("joki.survey_title")}
                    </Typography>

                    {/* Survey Options */}
                    <div className="space-y-3 mb-8">
                      {[
                        {
                          value: "instagram",
                          label: t("joki.opt_instagram"),
                          icon: <FaInstagram />,
                        },
                        {
                          value: "influencer",
                          label: t("joki.opt_influencer"),
                          icon: <FaBullhorn />,
                        },
                        {
                          value: "teman",
                          label: t("joki.opt_friend"),
                          icon: <FaUserFriends />,
                        },
                        {
                          value: "lain",
                          label: t("joki.opt_other"),
                          icon: <FaQuestionCircle />,
                        },
                      ].map((item) => (
                        <div key={item.value}>
                          <label
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
                            ${
                              source === item.value
                                ? "bg-blue-500/20 border border-blue-500"
                                : "bg-gray-800 hover:bg-gray-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name="survey-source"
                              checked={source === item.value}
                              onChange={() => selectSource(item.value)}
                              className="hidden"
                            />
                            <div
                              className={`w-9 h-9 flex items-center justify-center rounded-full
                              ${
                                source === item.value
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-700 text-gray-300"
                              }`}
                            >
                              {item.icon}
                            </div>
                            <span className="text-sm">{item.label}</span>
                          </label>

                          {item.value === "lain" && source === "lain" && (
                            <input
                              type="text"
                              placeholder={t("joki.other_placeholder")}
                              value={otherSource}
                              onChange={(e) => setOtherSource(e.target.value)}
                              className="mt-2 w-full p-3 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Button - Sticky bottom */}
                    <div className="sticky bottom-0 bg-gray-900 pt-2 pb-4 border-t border-gray-800">
                      <Btn
                        disabled={!isSurveyValid}
                        onClick={handleOrderWithSurvey}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold w-full transition
                        ${
                          isSurveyValid
                            ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                            : "bg-blue-400 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <FaShoppingCart />
                        {t("joki.continue_purchase")}
                      </Btn>
                    </div>
                  </div>
                </div>

                {/* Spacer untuk bottom menu (sesuaikan tingginya) */}
                <div className="h-16 bg-transparent" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
