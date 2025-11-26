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
  ShoppingCart,
  Star,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const formatPrice = (currency) => {
    const totalDisc = getTotalDiscount();

    switch (currency) {
      case "idr":
        return `Rp ${(
          productData.harga_rupiah -
          productData.harga_rupiah * (totalDisc / 100)
        ).toLocaleString("id-ID")}`;
      case "myr":
        return `RM ${(
          productData.harga_ringgit -
          productData.harga_ringgit * (totalDisc / 100)
        ).toLocaleString("en-MY")}`;
      case "usd":
        return `$${(
          productData.harga_dolar -
          productData.harga_dolar * (totalDisc / 100)
        ).toLocaleString("en-US")}`;
    }
  };

  const formatOriginalPrice = (currency) => {
    switch (currency) {
      case "idr":
        return `Rp ${productData.harga_rupiah.toLocaleString("id-ID")}`;
      case "myr":
        return `RM ${productData.harga_ringgit.toLocaleString("en-MY")}`;
      case "usd":
        return `$${productData.harga_dolar.toLocaleString("en-US")}`;
    }
  };

  async function reqDuitkuReference() {
    try {
      setIsLoadingSnap(true);
      const totalDisc = getTotalDiscount();

      const res = await fetch(
        getPaymentApiUrl("/api/duitku/callback"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            paymentAmount: productData.harga_rupiah,
            diskon: totalDisc,
            produkId: productData.id,
            buyerEmail: buyerWA,
            buyerLang: lang,
            paymentMethod: "I1",
            itemDetails: [
              { name: productData.nama, harga: productData.harga_rupiah },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.snapUrl) {
        navigate("/payment", {
          state: {
            snapUrl: data.snapUrl,
            snapStart: data.snapStart,
            snapEnd: data.snapEnd,
            buyerName,
            buyerEmail: buyerWA,
            product: {
              ...productData,
              diskon: totalDisc,
            },
            promo: {
              code: promoCode || null,
              promoDiscount,
            },
          },
        });
      } else {
        alert(data.error || "Gagal buat link pembayaran");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSnap(false);
    }
  }

  // loading state
  if (isLoading) {
    return (
      <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
      <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-red-900 to-slate-900">
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
    <section className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 text-white hover:text-blue-400 hover:bg-slate-800/50 transition-all"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t("back")}
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative group">
              <div
                className={`absolute -inset-1 bg-gradient-to-r ${productData.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500`}
              />
              <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50">
                <div className="relative aspect-[9/11]">
                  <ImageWithFallback
                    src={productData.images[currentImageIndex]}
                    alt={`${productData.nama} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-red-500 text-white px-4 py-2 animate-pulse">
                      -{productData.diskon} OFF
                    </Badge>
                  </div>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-slate-900 transition-all hover:scale-110"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-slate-900 transition-all hover:scale-110"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white text-sm">
                      {currentImageIndex + 1} / {productData.images.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productData.images.map((image, index) => (
                <button key={index} onClick={() => setCurrentImageIndex(index)}>
                  <ImageWithFallback
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50 p-6 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-white mb-2">{productData.nama}</h1>
                    <Badge
                      className={`bg-gradient-to-r from-purple-600 to-pink-600 border-0`}
                    >
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      {productData.rank}
                    </Badge>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-3 py-1">
                    <Shield className="h-4 w-4 mr-1" />
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl text-white">
                      {productData.heroes.length}
                    </p>
                    <p className="text-sm text-gray-400">{t("heroes_label")}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                    <p className="text-2xl text-white">
                      {productData.skins.length}
                    </p>
                    <p className="text-sm text-gray-400">{t("skins_label")}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50 p-6 shadow-2xl">
              <div className="space-y-6">
                <h3 className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  {t("price")}
                </h3>

                <div className="space-y-4">
                  {["idr", "myr", "usd"].map((cur) => (
                    <div key={cur} className="space-y-1">
                      <div className="text-xs text-gray-400 uppercase tracking-wider">
                        {cur.toUpperCase() === "IDR"
                          ? "Indonesian Rupiah"
                          : cur.toUpperCase() === "MYR"
                          ? "Malaysian Ringgit"
                          : "US Dollar"}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-2xl text-white">
                          {formatPrice(cur)}
                        </span>
                        {productData.diskon > 0 && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatOriginalPrice(cur)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* info diskon asli + promo */}
                  <div className="pt-2 border-t border-slate-700/50 space-y-1">
                    {productData.diskon > 0 && (
                      <p className="text-sm text-green-400 flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {productData.diskon}% OFF
                        </Badge>
                        <span>{t("discount_save_label")}</span>
                      </p>
                    )}

                    {promoDiscount > 0 && (
                      <p className="text-xs text-emerald-300">
                        {t("discount_promo_extra", { value: promoDiscount })}
                      </p>
                    )}

                    <p className="text-xs text-slate-400">
                      {t("discount_total", { value: getTotalDiscount() })}
                    </p>
                  </div>
                </div>

                {/* form kode promo */}
                <div className="mt-4 space-y-2">
                  <label className="block text-xs text-slate-300">
                    {t("promo_input_label")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={t("promo_placeholder")}
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value.toUpperCase());
                        setPromoError("");
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="bg-purple-600 text-white"
                      disabled={!promoCode || promoLoading}
                      onClick={async () => {
                        try {
                          setPromoLoading(true);
                          setPromoError("");

          const res = await fetch(
            getApiUrl("/api/kodepromo/validate")
          );
                          const json = await res.json();

                          const list = json.data || [];
                          const found = list.find(
                            (k) =>
                              k.kode.toLowerCase() === promoCode.toLowerCase()
                          );

                          if (!found) {
                            setPromoDiscount(0);
                            setPromoError(t("promo_not_found"));
                          } else {
                            setPromoDiscount(found.diskon || 0);
                          }
                        } catch (err) {
                          console.error(err);
                          setPromoError(t("promo_check_failed"));
                        } finally {
                          setPromoLoading(false);
                        }
                      }}
                    >
                      {promoLoading ? t("loading") : t("promo_apply")}
                    </Button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-red-400">{promoError}</p>
                  )}
                </div>

                <Button
                  disabled={productData.status === false}
                  onClick={() => setShowForm(true)}
                  className={`w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-white border-0`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {productData.status === false ? "Product Sold Out" : t("buy")}
                </Button>
              </div>
            </Card>

            <Card className="bg-slate-800/90 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full bg-slate-700/50 border-b border-slate-700/50 rounded-none h-auto p-0">
                  <TabsTrigger
                    value="description"
                    className="flex-1 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-3"
                  >
                    {t("desc")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="skins"
                    className="flex-1 data-[state=active]:bg-slate-600/50 data-[state=active]:text-white text-gray-400 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 py-3"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Hero & Skin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {!descriptionTranslate
                        ? t("no_desc")
                        : descriptionTranslate}
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      {[
                        "Email Access Included",
                        "Full Ownership",
                        "Instant Delivery",
                        "24/7 Support",
                      ].map((text, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-400"
                        >
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skins" className="p-6">
                  <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                    {productData.skins.map((skin, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-white">{skin.name}</p>
                          <p className="text-xs text-gray-400">{skin.hero}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
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
                reqDuitkuReference();
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
    </section>
  );
}
