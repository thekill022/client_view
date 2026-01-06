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
  CheckCircle,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Triangle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { WhyChoose } from "./whyChoose";

export function ProductPreview({ lang, id }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerWA, setBuyerWA] = useState("");
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    id: null,
    nama: "",
    harga_rupiah: 0,
    harga_ringgit: 0,
    harga_dolar: 0,
    diskon: 0,
    deskripsi: "",
    rank: "",
    status: true,
    gradient: "from-purple-500 via-pink-500 to-red-500",
    images: [],
    heroes: [],
    skins: [],
  });

  const [descriptionTranslate, setDescriptionTranslate] = useState("");

  // promo code state
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [isLoadingSnap, setIsLoadingSnap] = useState(false);
  const [openDesc, setOpenDesc] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [flashDiscount, setFlashDiscount] = useState(null);

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
        setDescriptionTranslate(product.deskripsi);

        console.log(product);

        const images = product.produkimg.map((img) => img.link);

        const heroes = product.produkimg.flatMap((img) =>
          img.hero.map((h) => ({ id: h.id, name: h.nama }))
        );

        const skins = product.produkimg.flatMap((img) =>
          img.hero.map((h) => ({
            id: h.skin.id,
            name: h.skin.nama,
            hero: h.nama,
          }))
        );

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

  async function translateDescription() {
    const res = await fetch(getApiUrl("/api/translate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: descriptionTranslate, lang: lang }),
    });
    const data = await res.json();
    if (data.text) setDescriptionTranslate(data.text);
  }

  useEffect(() => {
    if (productData.deskripsi) translateDescription();
  }, [lang, productData.deskripsi]);

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
    // Cek response fetch dulu
    try {
      const response = await fetch(getApiUrl("/api/flash-sale"));

      // Jika 404 (tidak ada flash sale) atau error lain, stop
      if (!response.ok) return;

      const json = await response.json(); // TAMBAHKAN AWAIT
      const res = json.data;

      if (res) {
        setIsFlashSale(true);
        setFlashDiscount(Number(res.diskon)); // GUNAKAN SETTER & PERBAIKI TYPO
      }
    } catch (err) {
      console.error("Gagal load flash sale:", err);
    }
  }

  useEffect(() => {
    flashSale();
  }, []);

  const formatPrice = () => {
    const totalDisc = flashDiscount ? flashDiscount : getTotalDiscount();

    switch (lang) {
      case "id":
        return `${(
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

  function sendWhatsAppOrder() {
    let message = "";
    switch (lang) {
      case "ms":
        message = `Halo Admin,%0ASaya ingin membuat pembelian akaun dengan butiran berikut:%0A%0AKod Akaun: ${productData.nama}%0A%0AMohon maklumkan sama ada akaun tersebut masih tersedia.%0A%0ATerima kasih.`;
        break;
      case "en":
        message = `Hello Admin,%0AI would like to purchase an account with the following details:%0A%0AAccount Code: ${productData.nama}%0A%0APlease let me know if it is still available.%0A%0AThank you.`;
        break;
      default: // id
        message = `Halo Admin,%0ASaya ingin membeli akun dengan detail berikut:%0A%0AKode Akun: ${productData.nama}%0A%0AMohon kabari jika akun ini masih tersedia.%0A%0ATerima kasih.`;
        break;
    }

    // Nomor WA admin
    const waNumber = "601128011202";
    const url = `https://wa.me/${waNumber}?text=${message}`;

    window.open(url, "_blank");
  }

  // loading state
  if (isLoading) {
    return (
      <section className="relative min-h-screen py-20 pt-5 overflow-hidden">
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
      <section className="relative min-h-screen py-20 pt-5 overflow-hidden">
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
    <section className="relative min-h-screen py-20 pt-5 overflow-hidden">
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

        <div className="grid lg:grid-cols-2 gap-8 -translate-y-25 lg:-translate-y-15">
          <div className="col-span-4 lg:col-span-1 lg:col-span-1 lg:flex lg:top-24 md:mt-0 mt-10 h-fit mb-10">
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
              <div className="flex mt-4 gap-2 px-10 flex-wrap py-4">
                {productData.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-30 h-30 border-white mb-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105
              ${
                index === currentImageIndex
                  ? "border-cyan-500 scale-105"
                  : "border-transparent"
              }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 col-span-4 lg:col-span-1 md:max-h-screen overflow-scroll">
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
                    <div
                      className={`py-2 text-center mb-4 font-bold rounded-lg w-full border
            ${
              productData.status
                ? "bg-[radial-gradient(circle,_#3db360,_#53d07a)] from- to-green-500 text-blue-950 text-4xl"
                : "bg-gradient-to-r from-red-600 to-red-500 text-blue-950 text-4xl"
            }`}
                    >
                      Status: {productData.status ? "Tersedia" : "Sold Out"}
                    </div>

                    <div className="py-2 text-center bg-[radial-gradient(circle,_#fcb205,_#fc7905)] font-bold rounded-lg w-full text-4xl text-white">
                      Rank: {productData.rank || "-"}
                    </div>
                    <div className="mt-4 w-full flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder={t("promo_placeholder")}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        onClick={() => sendWhatsAppOrder()}
                        className="bg-green-500 text-white w-full mt-2"
                      >
                        {t("buy")}
                      </Button>
                      <Button
                        disabled={promoLoading || !promoCode}
                        onClick={applyPromoCode}
                        className="bg-yellow-500 text-white w-full"
                      >
                        {promoLoading
                          ? t("loading")
                          : t("promo_apply") || "Apply"}
                      </Button>

                      {promoError && (
                        <p className="text-red-500 text-sm text-center">
                          {t("promo_check_failed")}
                        </p>
                      )}

                      {promoDiscount > 0 && (
                        <p className="text-green-700 font-bold text-center">
                          {t("promo_apply")}: -{promoDiscount}%
                        </p>
                      )}
                    </div>
                    {promoDiscount > 0 && (
                      <p className="text-green-700 font-bold">
                        -{promoDiscount}% (~{formatPrice()})
                      </p>
                    )}
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
                className={`fill-black w-4 translate-y-0.5 ${
                  openDesc ? "rotate-180" : ""
                } duration-300`}
              />
            </div>

            {openDesc && (
              <div className="bg-white rounded-md p-4 text-xl font-medium">
                {productData.deskripsi}
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-96 border border-slate-700">
            <h2 className="text-white text-xl mb-4">{t("checkout_title")}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input
                className="w-full mb-3 p-3 rounded bg-slate-700 text-white"
                placeholder={t("checkout_name_placeholder")}
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
              />

              <input
                className="w-full mb-4 p-3 rounded bg-slate-700 text-white"
                placeholder={t("checkout_email_placeholder")}
                type="email"
                value={buyerWA}
                onChange={(e) => setBuyerWA(e.target.value)}
              />

              <Button
                disabled={isLoadingSnap}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                {isLoadingSnap ? "Loading..." : t("checkout_go_to_payment")}
              </Button>

              <Button
                onClick={() => setShowForm(false)}
                variant="ghost"
                className="mt-2 w-full text-gray-300"
              >
                {t("cancel")}
              </Button>
            </form>
          </div>
        </div>
      )}

      {isFlashSale && (
        <div class="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-[#042057] via-[#0D3FA0] to-[#042057] p-4 shadow-top border-t border-blue-800">
          <div class="w-full flex space-y-2 flex-col gap-2">
            <div class="flex justify-between items-start text-white">
              <div>
                <p class="text-xl font-bold text-white -mt-1 truncate max-w-48">
                  {productData.nama}
                </p>
              </div>
              <div class="border border-green-400 bg-green-900/50 text-green-300 text-xs font-semibold px-3 py-1 rounded-md">
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
            <div class="flex justify-between">
              <div class="text-white ">
                <div>
                  <p class="text-sm text-red-500 line-through">
                    Rp {formatOriginalPrice()}
                  </p>
                  <p class="text-2xl font-bold text-green-400 -mt-1">
                    Rp {formatPrice()}
                  </p>
                </div>
              </div>
              <div class="flex flex-col items-end">
                <p class="text-3xl font-extrabold text-white italic -mb-1">
                  FLASHSALE
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                onClick={sendWhatsAppOrder}
                class="font-bold w-1/2 px-5 py-2 rounded-lg border text-sm transition-opacity bg-transparent border-white text-white"
                fdprocessedid="dwoaaa"
              >
                {lang == "en" ? "Negotiate" : "Nego"}
              </button>
              <button
                onClick={sendWhatsAppOrder}
                class="bg-white w-1/2 text-[#042057] font-bold px-6 py-3 rounded-lg shadow-md text-sm"
                fdprocessedid="fbiaku"
              >
                {t("buy")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
