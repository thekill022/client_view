"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getApiUrl, getPaymentApiUrl } from "../config/api";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Triangle,
  ShoppingCart,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WhyChoose } from "./whyChoose";
import {
  Drawer,
  Button as Btn,
  Typography,
  IconButton,
} from "@material-tailwind/react";
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

export function ProductPreview({ lang, id }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerWA, setBuyerWA] = useState("");
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();
  const [openBottom, setOpenBottom] = useState(false);
  const [openBottomCicil, setOpenBottomCicil] = useState(false);

  const resetPromo = () => {
    setPromoCode("");
    setPromoDiscount(0);
    setPromoError("");
  };

  const openDrawerBottom = () => setOpenBottom(true);
  const closeDrawerBottom = () => {
    setOpenBottom(false);
    resetPromo();
  };
  const openDrawerBottomCicil = () => setOpenBottomCicil(true);
  const closeDrawerBottomCicil = () => {
    setOpenBottomCicil(false);
    resetPromo();
  };

  // untuk checkbox survei
  const [source, setSource] = useState("");
  const [otherSource, setOtherSource] = useState("");

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

  const toggleSource = (value) => {
    setSources((prev) => {
      if (prev.includes(value)) {
        if (value === "lain") setOtherSource("");
        return prev.filter((v) => v !== value);
      }
      return [...prev, value];
    });
  };

  const [productData, setProductData] = useState({
    id: null,
    nama: "",
    harga_rupiah: 0,
    harga_ringgit: 0,
    harga_dolar: 0,
    diskon: 0,
    rank: "",
    status: true,
    gradient: "from-purple-500 via-pink-500 to-red-500",
    images: [],
    heroes: [],
    skins: [],
  });



  // promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [isLoadingSnap, setIsLoadingSnap] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState(null);
  const [flashEndTime, setFlashEndTime] = useState(null);

  // loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching product data for ID:", id);

        const res = await fetch(getApiUrl(`/api/akun/${id}`));

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Product not found");
          }
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();

        if (!data.data) {
          throw new Error("Product not found");
        }

        const product = data.data;

        console.log(product);

        // Safely map images with fallback to empty array
        const images = Array.isArray(product.produkimg)
          ? product.produkimg.map((img) => img.link).filter(Boolean)
          : [];

        // Safely map heroes with null checks
        const heroes = Array.isArray(product.produkimg)
          ? product.produkimg.flatMap((img) =>
            Array.isArray(img.hero)
              ? img.hero.map((h) => ({ id: h.id, name: h.nama }))
              : []
          )
          : [];

        // Safely map skins with null checks
        const skins = Array.isArray(product.produkimg)
          ? product.produkimg.flatMap((img) =>
            Array.isArray(img.hero)
              ? img.hero
                .filter((h) => h.skin) // Only include if skin exists
                .map((h) => ({
                  id: h.skin.id,
                  name: h.skin.nama,
                  hero: h.nama,
                }))
              : []
          )
          : [];

        setProductData({
          ...product,
          images,
          heroes,
          skins,
        });
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [id]);



  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productData.images.length - 1 : prev - 1
    );
  };

  const getTotalDiscount = () => {
    const base = productData.diskon || 0;
    const extra = promoDiscount || 0;
    const total = base + extra;
    // batasi maksimal 90% supaya tidak minus / aneh
    return total > 90 ? 90 : total;
  };

  async function flashSale() {
    try {
      const response = await fetch(getApiUrl("/api/flash-sale"));
      if (!response.ok) return;

      const json = await response.json();
      const res = json.data;

      if (res) {
        setIsFlashSale(true);
        setFlashDiscount(Number(res.diskon));
        setFlashEndTime(new Date(res.end_date));
      }
    } catch (err) {
      console.error("Gagal load flash sale:", err);
    }
  }

  useEffect(() => {
    flashSale();
  }, []);

  useEffect(() => {
    if (!isFlashSale || !flashEndTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      if (now >= flashEndTime) {
        setIsFlashSale(false);
        setFlashDiscount(null);
        setFlashEndTime(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isFlashSale, flashEndTime]);

  const formatPrice = () => {
    const totalDisc = flashDiscount ? flashDiscount : getTotalDiscount();

    switch (lang) {
      case "id":
        return `Rp ${(
          productData.harga_rupiah -
          productData.harga_rupiah * (totalDisc / 100)
        ).toLocaleString("id-ID")}`;
      case "ms":
        return `RM ${(
          productData.harga_ringgit -
          productData.harga_ringgit * (totalDisc / 100)
        ).toLocaleString("en-MY")}`;
      default:
        // english / lainnya
        return `$${(
          productData.harga_dolar -
          productData.harga_dolar * (totalDisc / 100)
        ).toLocaleString("en-US")}`;
    }
  };

  const formatOriginalPrice = () => {
    switch (lang) {
      case "id":
        return `Rp ${productData.harga_rupiah.toLocaleString("id-ID")}`;
      case "ms":
        return `RM ${productData.harga_ringgit.toLocaleString("en-MY")}`;
      default:
        return `$${productData.harga_dolar.toLocaleString("en-US")}`;
    }
  };

  async function applyPromoCode() {
    if (!promoCode) return setPromoError("Kode promo tidak boleh kosong");

    try {
      setPromoLoading(true);
      setPromoError("");

      // pilih harga sesuai bahasa / currency
      const price = (() => {
        switch (lang) {
          case "id":
            return productData.harga_rupiah;
          case "ms":
            return productData.harga_ringgit;
          default:
            return productData.harga_dolar;
        }
      })();

      const res = await fetch(getApiUrl("/api/kodepromo/validate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kode: promoCode.toUpperCase(),
          paymentAmount: price,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        // update state diskon dari API
        setPromoDiscount(data.data.diskon_persen);
      } else {
        setPromoDiscount(0);
        setPromoError(data.message || "Kode promo tidak valid");
      }
    } catch (err) {
      console.error(err);
      setPromoError("Gagal mengecek kode promo");
      setPromoDiscount(0);
    } finally {
      setPromoLoading(false);
    }
  }

  // untuk rekomendasi product lainnya
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [recError, setRecError] = useState(null);

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

  const isPromoValid = promoDiscount > 0 && promoCode;

  useEffect(() => {
    async function getProduct() {
      try {
        setRecLoading(true);
        setRecError(null);

        const res = await fetch(getApiUrl("/api/produk/highlight"));
        if (!res.ok) throw new Error("Gagal memuat rekomendasi");

        const data = await res.json();
        const raw = data.data || [];

        if (raw.length === 0) {
          setRecommendations([]);
          return;
        }

        const sorted = raw.sort((a, b) => b.id - a.id);
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
        mapped.length = 4;

        setRecommendations(mapped);
      } catch (err) {
        console.error(err);
        setRecError(err.message || "Terjadi kesalahan");
      } finally {
        setRecLoading(false);
      }
    }

    getProduct();
  }, [productData.id, lang]);

  function sendWhatsAppOrder() {
    const promoMessage = isPromoValid
      ? `%0AKode Promo: ${promoCode.toUpperCase()} (${promoDiscount}% OFF)`
      : "";

    let message = "";
    switch (lang) {
      case "ms":
        message =
          `Halo Admin,%0ASaya ingin membuat pembelian akaun dengan butiran berikut:%0A%0A` +
          `Link Akaun: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0AMohon maklumkan sama ada akaun tersebut masih tersedia.%0A%0ATerima kasih.`;
        break;

      case "en":
        message =
          `Hello Admin,%0AI would like to purchase an account with the following details:%0A%0A` +
          `Account Link: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0APlease let me know if it is still available.%0A%0AThank you.`;
        break;

      default: // id
        message =
          `Halo Admin,%0ASaya ingin membeli akun dengan detail berikut:%0A%0A` +
          `Kode Link: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0AMohon kabari jika akun ini masih tersedia.%0A%0ATerima kasih.`;
    }

    const waNumber = "601164498139";
    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
  }

  function sendWhatsAppOrderCicil() {
    const promoMessage = isPromoValid
      ? `%0AKode Promo: ${promoCode.toUpperCase()} (${promoDiscount}% OFF)`
      : "";

    let message = "";
    switch (lang) {
      case "ms":
        message =
          `Halo Admin,%0ASaya ingin membuat pembelian akaun secara ansur dengan butiran berikut:%0A%0A` +
          `Kod Akaun: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0AMohon maklumkan sama ada akaun tersebut masih tersedia.%0A%0ATerima kasih.`;
        break;

      case "en":
        message =
          `Hello Admin,%0AI would like to purchase an account in installments with the following details:%0A%0A` +
          `Account Code: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0APlease let me know if it is still available.%0A%0AThank you.`;
        break;

      default: // id
        message =
          `Halo Admin,%0ASaya ingin membeli akun secara angsuran dengan detail berikut:%0A%0A` +
          `Kode Akun: ${window.location.href}%0A` +
          promoMessage +
          `%0A%0AMohon kabari jika akun ini masih tersedia.%0A%0ATerima kasih.`;
    }

    const waNumber = "601164498139";
    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
  }

  // loading state
  if (isLoading) {
    return (
      <section className="relative min-h-screen py-20 pt-5">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            <p className="text-white text-xl">{t("loading")}</p>
          </div>
        </div>
      </section>
    );
  }

  // error state (404 not found atau error lainnya)
  if (error) {
    return (
      <section className="relative min-h-screen py-20 pt-5">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/90 backdrop-blur-xl border-red-500/50 p-8 shadow-2xl max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/50">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {error === "Product not found" ? "404" : "Error"}
                </h1>
                <h2 className="text-xl text-red-300">
                  {error === "Product not found"
                    ? t("product_not_found_title") || "Product Not Found"
                    : t("error_occurred") || "Something Went Wrong"}
                </h2>
              </div>

              <p className="text-slate-300 max-w-md">
                {error === "Product not found"
                  ? t("product_not_found_desc") ||
                  "The product you're looking for doesn't exist or has been removed."
                  : t("error_desc") ||
                  "An error occurred while loading this product. Please try again later."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-4">
                <Button
                  onClick={() => navigate("/product")}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  {t("browse_products") || "Browse Products"}
                </Button>

                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-500 hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("back") || "Go Back"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen py-20 pt-5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-white hover:text-blue-400 hover:bg-slate-800/50 transition-all"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t("back")}
        </Button>

        <WhyChoose />

        <div className="grid lg:grid-cols-3 gap-8 -mt-25 lg:-mt-15">
          <div className="col-span-4 lg:col-span-1 lg:sticky lg:top-24 md:mt-0 mt-10 h-fit mb-10">
            <div className="bg-gradient-to-r from-blue-700  to-blue-400 backdrop-blur-xl rounded-lg w-full max-w-full xl:max-w-md border border-slate-700/50">
              {/* MAIN SLIDER */}
              <div className="relative w-full overflow-hidden rounded-t-lg rounded-b-3xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {productData.images.map((img, index) => (
                    <div key={index} className="relative w-full flex-shrink-0">
                      <ImageWithFallback
                        src={img}
                        alt={`${productData.nama} ${index + 1}`}
                        className="w-full aspect-[4/5] object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* NAV BUTTON */}
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all hover:scale-110"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-all hover:scale-110"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div
                className="
    my-4
    flex
    gap-3
    px-4
    py-3
    overflow-x-auto
    scrollbar-hide
    snap-x
    snap-mandatory
  "
              >
                {productData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
        relative
        flex-shrink-0
        w-20 h-20
        md:w-28 md:h-28
        rounded-lg
        overflow-hidden
        border-2
        transition-all
        duration-300
        snap-center
        ${index === currentImageIndex
                        ? "border-cyan-500 scale-105"
                        : "border-transparent"
                      }
      `}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 col-span-4 lg:col-span-2">
            {/* PRICE CARD */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              {/* HEADER */}
              <div className="bg-[#0190FF] w-full flex items-center justify-center space-x-5 px-5 py-4 rounded-xl rounded-b-2xl">
                <div className="w-4 h-4 bg-white rotate-45 drop-shadow"> </div>
                <h1 className="font-black text-lg md:text-3xl lg:text-3xl text-white">
                  {productData.nama}
                </h1>
                <div className="w-4 h-4 bg-white rotate-45 drop-shadow"> </div>
              </div>

              {/* BODY */}
              <div className="bg-[#EAEAEA] rounded-b-xl py-8">
                <div className="w-11/12 mx-auto space-y-6">
                  {/* PRICE */}
                  <div>
                    <h3 className="text-[#121926] font-bold text-xl font-black lg:text-xl mb-2">
                      {t("price")}
                    </h3>

                    <div className="flex w-full justify-between items-center gap-4">
                      <h1 className="text-[#0E467D] font-extrabold text-4xl lg:text-5xl w-full">
                        {formatPrice()}
                      </h1>

                      {productData.diskon > 0 && (
                        <h2 className="text-[#FF0000] bg-[#2E0D0D] line-through decoration-white font-bold text-xl text-center py-2 px-3 rounded-lg w-full">
                          {formatOriginalPrice()}
                        </h2>
                      )}
                    </div>
                  </div>

                  {/* STATUS & RANK */}
                  <div>
                    <Btn
                      className={`py-2 text-center mb-4 font-bold rounded-lg w-full border
            ${productData.status
                          ? "bg-[radial-gradient(circle,_#3db360,_#53d07a)] from- to-green-500 text-white text-2xl"
                          : "bg-gradient-to-r from-red-600 to-red-500 text-blue-950 text-2xl"
                        }`}
                    >
                      Status: {productData.status ? "Tersedia" : "Sold Out"}
                    </Btn>

                    <Btn className="py-2 text-center bg-[radial-gradient(circle,_#fcb205,_#fc7905)] font-bold rounded-lg w-full text-2xl text-white">
                      Rank: {productData.rank || "-"}
                    </Btn>
                  </div>
                </div>
              </div>
            </Card>

            <div
              onClick={() => setOpenDesc(!openDesc)}
              className="bg-white p-2 rounded-md flex justify-center items-center font-black text-xl gap-2"
            >
              {t("desc")}{" "}
              <Triangle
                className={`fill-black w-4 translate-y-0.5 ${openDesc ? "rotate-180" : ""
                  } duration-300`}
              />
            </div>

            {openDesc && (
              <div className="bg-white rounded-md p-4 text-lg text-blue-900 font-semibold text-justify font-sans whitespace-pre-line">
                {lang === "ms" ? (
                  <>
                    🎮 ACC MLBB Sedia Digunakan 🎮<br />
                    Berbagai pilihan akaun dengan keadaan berbeza, boleh disesuaikan mengikut keperluan.
                    <br /><br />
                    📍 Tak boleh DM?<br />
                    👉 Reply Story ya
                    <br /><br />
                    📩 Follow & Hubungi melalui DM<br />
                    Untuk maklumat lanjut, spesifikasi akaun, dan proses urus niaga.
                    <br /><br />
                    ⚠️ Nota Penting ⚠️
                    <br />
                    Akaun diserahkan dalam keadaan baik semasa transaksi selesai.<br />
                    Sila buat semakan sebelum pengesahan.<br />
                    Garansi diberikan selama 30 hari mengikut terma yang ditetapkan.
                  </>
                ) : lang === "id" ? (
                  <>
                    🎮 ACC MLBB Siap Pakai 🎮<br />
                    Berbagai pilihan akun dengan kondisi berbeda, bisa disesuaikan dengan kebutuhan.
                    <br /><br />
                    📍 Tidak bisa DM?<br />
                    👉 Reply Story ya
                    <br /><br />
                    📩 Follow & Hubungi melalui DM<br />
                    Untuk informasi lebih lanjut, spesifikasi akun, dan proses transaksi.
                    <br /><br />
                    ⚠️ Catatan Penting ⚠️<br />
                    Akun diserahkan dalam kondisi baik saat transaksi selesai.<br />
                    Silakan lakukan pengecekan sebelum konfirmasi.<br />
                    Garansi diberikan selama 30 hari sesuai ketentuan yang berlaku.
                  </>
                ) : (
                  <>
                    🎮 MLBB ACC Ready to Use 🎮<br />
                    Various account options with different conditions, can be customized according to your needs.
                    <br /><br />
                    📍 Can't DM?<br />
                    👉 Reply to Story
                    <br /><br />
                    📩 Follow & Contact via DM<br />
                    For more information, account specifications, and transaction process.
                    <br /><br />
                    ⚠️ Important Note ⚠️<br />
                    Account is delivered in good condition when transaction is completed.<br />
                    Please check before confirmation.<br />
                    Warranty is provided for 30 days according to the terms and conditions.
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between gap-2 mb-6">
          <h2 className="flex gap-2 items-center text-[12px] md:text-2xl font-extrabold text-white">
            <FaShoppingCart className="text-blue-500" />
            Produk Rekomendasi
          </h2>
          <a
            href="/product"
            className="text-white font-bold text-[12px] md:text-xl"
          >
            Selengkapnya {">"}
          </a>
        </div>

        {/* LOADING */}
        {recLoading && (
          <div className="flex justify-center py-10">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        )}

        {/* ERROR */}
        {!recLoading && recError && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl p-6 text-center text-red-400">
            <AlertCircle className="mx-auto mb-2" />
            {recError}
          </div>
        )}

        {/* EMPTY */}
        {!recLoading && !recError && recommendations.length === 0 && (
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 text-center text-slate-400">
            Produk rekomendasi tidak tersedia saat ini.
          </div>
        )}

        {/* LIST */}
        {!recLoading && !recError && recommendations.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.map((item) => (
              <div key={`${item.id}`} className="relative group h-full">
                {/* --- CARD CONTAINER UTAMA --- */}
                <div className="relative flex flex-col h-full bg-[#007aff] rounded-lg sm:rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 hover:-translate-y-2 transition-transform duration-300">
                  {/* --- DISKON BADGE (Pojok Kanan Atas) --- */}
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 z-20">
                    {isFlashSale ? (
                      <img
                        src="/assets/images/flash.png"
                        alt="Flash Sale"
                        className="h-16 md:h-30 w-auto drop-shadow-xl animate-pulse"
                      />
                    ) : (
                      <div className="bg-[#FF0000] text-yellow-300 font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-sm px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-bl-[15px] sm:rounded-bl-[25px] rounded-tr-[12px] sm:rounded-tr-[20px] shadow-lg border-b border-l sm:border-b-2 sm:border-l-2 border-white/20 transform skew-x-[-5deg]">
                        DISKON {item.discount}
                      </div>
                    )}
                  </div>

                  {/* --- IMAGE AREA (Mengisi sebagian besar atas) --- */}
                  <div className="pb-0 flex-grow relative min-h-[120px] sm:min-h-[140px] md:min-h-[180px]">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* --- INFO SECTION (Footer Biru) --- */}
                  <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-1.5 sm:pt-2 relative z-10">
                    {/* Judul Produk */}
                    <h3 className="text-white font-black text-xs xs:text-sm sm:text-base md:text-xl italic uppercase leading-tight tracking-wide drop-shadow-md line-clamp-1 min-h-[1em] mb-1 sm:mb-1.5">
                      {item.name}
                    </h3>

                    <div className="flex justify-between items-end mb-2 sm:mb-3 gap-1">
                      {/* Bagian Harga (Kiri) */}
                      <div className="flex flex-col flex-1 min-w-0">
                        {/* Harga Coret Merah */}
                        <div className="relative w-fit mb-0.5">
                          <span className="text-white/60 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold italic whitespace-nowrap">
                            {lang === "id"
                              ? `RP.${Number(
                                item.harga_rupiah
                              ).toLocaleString()}`
                              : lang === "en"
                                ? `${Number(item.harga_dolar).toLocaleString()}`
                                : `RM${Number(
                                  item.harga_ringgit
                                ).toLocaleString()}`}
                          </span>
                          <div className="absolute top-1/2 left-0 w-full h-[1.5px] bg-red-600 -rotate-2"></div>
                        </div>
                        {/* Harga Utama */}
                        <div className="text-white font-black text-xs xs:text-sm sm:text-base md:text-2xl italic leading-none tracking-tight">
                          {lang === "id"
                            ? `Rp.${Math.round(
                              (item.harga_rupiah *
                                (100 -
                                  parseInt(item.discount.replace("%", "")))) /
                              100
                            ).toLocaleString()}`
                            : lang === "en"
                              ? `$${Math.round(
                                (item.harga_dolar *
                                  (100 -
                                    parseInt(item.discount.replace("%", "")))) /
                                100
                              ).toLocaleString()}`
                              : `RM${Math.round(
                                (item.harga_ringgit *
                                  (100 -
                                    parseInt(item.discount.replace("%", "")))) /
                                100
                              ).toLocaleString()}`}
                        </div>
                      </div>
                    </div>

                    {/* --- TOMBOL BUY (Dibawah Free/Harga) --- */}
                    <a href={"/preview/" + item.id} className="block w-full">
                      <Button
                        className={`w-full bg-gradient-to-r ${item.gradient} text-white font-black italic text-[9px] xs:text-[10px] sm:text-xs md:text-base py-2 sm:py-3 md:py-5 rounded-lg sm:rounded-xl hover:translate-y-[2px] transition-all border-none uppercase tracking-wider`}
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
        )}
      </div>

      {!isFlashSale && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#042057] via-[#0D3FA0] to-[#042057] p-4 shadow-top border-t border-blue-800">
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-start text-white">
              <div>
                <p className="text-xl font-bold text-white -mt-1 truncate max-w-48">
                  {productData.nama}
                </p>
              </div>
              <div className="border border-green-400 bg-green-900/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-md">
                Status:{" "}
                {productData.status
                  ? lang == "en"
                    ? "Available"
                    : "Tersedia"
                  : lang == "en"
                    ? "Sold Out"
                    : "Terjual"}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-white">
                <div className="flex gap-2 flex-row-reverse">
                  <p className="text-sm text-red-500 line-through">
                    {formatOriginalPrice()}
                  </p>
                  <p className="text-2xl font-bold text-green-400 -mt-1">
                    {formatPrice()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Btn
                onClick={openDrawerBottomCicil}
                className="font-bold w-1/2 px-5 py-3 rounded-lg border text-sm transition-opacity border-white text-white bg-transparent"
              >
                {lang === "en" ? "Installment" : lang === "id" ? "Angsur" : "Ansur"}
              </Btn>
              <Btn
                onClick={openDrawerBottom}
                className="bg-white w-1/2 text-[#042057] font-bold px-6 py-3 rounded-lg shadow-md text-sm"
              >
                {t("buy")}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {isFlashSale && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#042057] via-[#0D3FA0] to-[#042057] p-4 shadow-top border-t border-blue-800">
          <div className="w-full flex space-y-2 flex-col gap-2">
            <div className="flex justify-between items-start text-white">
              <div>
                <p className="text-xl font-bold text-white -mt-1 truncate max-w-48">
                  {productData.nama}
                </p>
              </div>
              <div className="border border-green-400 bg-green-900/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-md">
                Status:{" "}
                {productData.status
                  ? lang == "en"
                    ? "Available"
                    : "Tersedia"
                  : lang == "en"
                    ? "Sold Out"
                    : "Terjual"}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-white ">
                <div>
                  <p className="text-sm text-red-500 line-through">
                    {formatOriginalPrice()}
                  </p>
                  <p className="text-2xl font-bold text-green-400 -mt-1">
                    {formatPrice()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-3xl font-extrabold text-white italic -mb-1">
                  FLASHSALE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Btn
                onClick={openDrawerBottomCicil}
                className="font-bold w-1/2 px-5 py-2 rounded-lg border text-sm transition-opacity bg-transparent border-white text-white"
              >
                {lang === "en" ? "Installment" : lang === "id" ? "Angsur" : "Ansur"}
              </Btn>
              <Btn
                onClick={openDrawerBottom}
                className="bg-white w-1/2 text-[#042057] font-bold px-6 py-3 rounded-lg shadow-md text-sm"
              >
                {t("buy")}
              </Btn>
            </div>
          </div>
        </div>
      )}

      {/* buttom drawer */}
      <Drawer
        placement="bottom"
        open={openBottom}
        onClose={closeDrawerBottom}
        className="bg-gray-900 text-white z-9999 rounded-t-2xl p-4 overflow-y-scroll"
        size={500}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-blue-500 text-xl" />
            <Typography variant="h5" color="white">
              Merzz MLBB
            </Typography>
          </div>

          <button onClick={closeDrawerBottom}>
            <FaTimes className="text-white text-lg opacity-70 hover:opacity-100" />
          </button>
        </div>

        {/* Promo Section */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FaTag className="text-yellow-400" />
            {lang === "ms" ? "Gunakan kode promo (Jika Ada)" : lang === "id" ? "Gunakan kode promo (Jika Ada)" : "Use promo code (If Available)"}
          </div>

          <input
            type="text"
            placeholder={t("promo_placeholder")}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <Button
            disabled={promoLoading || !promoCode}
            onClick={applyPromoCode}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg"
          >
            {promoLoading ? t("loading") : t("promo_apply")}
          </Button>

          {promoError && (
            <p className="text-red-400 text-xs text-center">
              {t("promo_check_failed")}
            </p>
          )}

          {promoDiscount > 0 && (
            <p className="text-green-400 text-sm text-center font-semibold">
              🎉 Diskon {promoDiscount}% (~{formatPrice()})
            </p>
          )}
        </div>

        {/* Survey Title */}
        <Typography className="mb-4 font-medium text-white text-base">
          {lang === "ms" ? "Kamu tahu Merzz MLBB dari mana?" : lang === "id" ? "Kamu tahu Merzz MLBB dari mana?" : "How did you know about Merzz MLBB?"}
        </Typography>

        {/* Survey Options */}
        <div className="space-y-3 mb-8">
          {[
            {
              value: "instagram",
              label: "Instagram",
              icon: <FaInstagram />,
            },
            {
              value: "influencer",
              label: "Influencer",
              icon: <FaBullhorn />,
            },
            {
              value: "teman",
              label: "Rekomendasi Teman",
              icon: <FaUserFriends />,
            },
            {
              value: "lain",
              label: "Lain-lain",
              icon: <FaQuestionCircle />,
            },
          ].map((item) => (
            <div key={item.value}>
              <label
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
            ${source === item.value
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
              ${source === item.value
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
                  placeholder="Contoh: Facebook, Google, Iklan Website"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  className="mt-2 w-full p-3 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full">
          <Btn
            disabled={!isSurveyValid}
            onClick={async () => {
              try {
                await submitSurvey();
              } catch (e) {
                alert("Somethink went wrong, please try again");
              }
              closeDrawerBottom();
              sendWhatsAppOrder();
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold w-full transition
      ${isSurveyValid
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-blue-400 cursor-not-allowed opacity-60"
              }`}
          >
            <FaShoppingCart />
            {lang === "ms" ? "Lanjut Ke Pembelian" : lang === "id" ? "Lanjut Ke Pembelian" : "Continue to Purchase"}
          </Btn>
        </div>
      </Drawer>

      {/* buttom drawer */}
      <Drawer
        placement="bottom"
        open={openBottomCicil}
        onClose={closeDrawerBottomCicil}
        className="bg-gray-900 text-white z-9999 rounded-t-2xl p-4 overflow-y-scroll"
        size={500}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-blue-500 text-xl" />
            <Typography variant="h5" color="white">
              Merzz MLBB
            </Typography>
          </div>

          <button onClick={closeDrawerBottomCicil}>
            <FaTimes className="text-white text-lg opacity-70 hover:opacity-100" />
          </button>
        </div>

        {/* Promo Section */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <FaTag className="text-yellow-400" />
            {lang === "ms" ? "Gunakan kode promo (Jika Ada)" : lang === "id" ? "Gunakan kode promo (Jika Ada)" : "Use promo code (If Available)"}
          </div>

          <input
            type="text"
            placeholder={t("promo_placeholder")}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <Button
            disabled={promoLoading || !promoCode}
            onClick={applyPromoCode}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg"
          >
            {promoLoading ? t("loading") : t("promo_apply")}
          </Button>

          {promoError && (
            <p className="text-red-400 text-xs text-center">
              {t("promo_check_failed")}
            </p>
          )}

          {promoDiscount > 0 && (
            <p className="text-green-400 text-sm text-center font-semibold">
              🎉 Diskon {promoDiscount}% (~{formatPrice()})
            </p>
          )}
        </div>

        {/* Survey Title */}
        <Typography className="mb-4 font-medium text-white text-base">
          {lang === "ms" ? "Kamu tahu Merzz MLBB dari mana?" : lang === "id" ? "Kamu tahu Merzz MLBB dari mana?" : "How did you know about Merzz MLBB?"}
        </Typography>

        {/* Survey Options */}
        <div className="space-y-3 mb-8">
          {[
            {
              value: "instagram",
              label: "Instagram",
              icon: <FaInstagram />,
            },
            {
              value: "influencer",
              label: "Influencer",
              icon: <FaBullhorn />,
            },
            {
              value: "teman",
              label: "Rekomendasi Teman",
              icon: <FaUserFriends />,
            },
            {
              value: "lain",
              label: "Lain-lain",
              icon: <FaQuestionCircle />,
            },
          ].map((item) => (
            <div key={item.value}>
              <label
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
            ${source === item.value
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
              ${source === item.value
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
                  placeholder="Contoh: Facebook, Google, Iklan Website"
                  value={otherSource}
                  onChange={(e) => setOtherSource(e.target.value)}
                  className="mt-2 w-full p-3 rounded-lg bg-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full">
          <Btn
            disabled={!isSurveyValid}
            onClick={async () => {
              try {
                await submitSurvey();
              } catch (e) {
                alert("Somethink went wrong, please try again");
              }
              closeDrawerBottomCicil();
              sendWhatsAppOrderCicil();
            }}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold w-full transition
      ${isSurveyValid
                ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                : "bg-blue-400 cursor-not-allowed opacity-60"
              }`}
          >
            <FaShoppingCart />
            {lang === "ms" ? "Lanjut Ke Pembelian" : lang === "id" ? "Lanjut Ke Pembelian" : "Continue to Purchase"}
          </Btn>
        </div>
      </Drawer>
    </section>
  );
}
