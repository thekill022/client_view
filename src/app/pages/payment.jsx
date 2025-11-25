import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/navbar";
import { Footer } from "../../components/Footer";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const s = String(safeSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");
  const routeState = location.state || {};

  const { snapUrl, snapEnd, buyerName, buyerEmail, product } = routeState;

  const effectiveDiscount = product?.diskon || 0;

  const finalIdrPrice = useMemo(() => {
    if (!product?.harga_rupiah) return 0;
    const base = product.harga_rupiah;
    const disc = effectiveDiscount;
    const value = Math.round((base * (100 - disc)) / 100);
    return value;
  }, [product?.harga_rupiah, effectiveDiscount]);

  // Jika user akses langsung tanpa state, redirect balik ke product
  useEffect(() => {
    if (!snapUrl || !snapEnd || !product) {
      navigate("/product", { replace: true });
    }
  }, [snapUrl, snapEnd, product, navigate]);

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!snapEnd) return 0;
    const diff = (snapEnd - Date.now()) / 1000;
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (!snapEnd) return;

    const interval = setInterval(() => {
      const diff = (snapEnd - Date.now()) / 1000;
      if (diff <= 0) {
        setRemainingSeconds(0);
        clearInterval(interval);
      } else {
        setRemainingSeconds(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [snapEnd]);

  const isExpired = useMemo(() => remainingSeconds <= 0, [remainingSeconds]);

  const currentPage = "/payment";

  return (
    <>
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        languange={() => {}}
      />

      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
            {t("payment_confirm_title")}
          </h1>

          <Card className="bg-slate-800/90 border-slate-700/70 p-6 md:p-8 flex flex-col md:flex-row gap-6">
            {/* Gambar produk */}
            <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
              {product?.images?.[0] && (
                <div className="w-full aspect-square overflow-hidden rounded-xl border border-slate-700/60">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.nama}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm text-slate-400">
                  {t("payment_buyer_name")}
                </p>
                <p className="text-base text-white font-medium">
                  {buyerName || "-"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {t("payment_buyer_email")}
                </p>
                <p className="text-xs text-slate-300 break-all">
                  {buyerEmail || "-"}
                </p>
              </div>
            </div>

            {/* Detail produk & countdown */}
            <div className="w-full md:w-2/3 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl text-white font-semibold">
                  {product?.nama}
                </h2>
                <p className="text-sm text-slate-400">Rank: {product?.rank}</p>

                <div className="mt-2">
                  <p className="text-xs text-slate-400 mb-1">Harga</p>
                  <p className="text-lg text-emerald-400 font-semibold">
                    {product?.harga_rupiah
                      ? `Rp ${finalIdrPrice.toLocaleString("id-ID")}`
                      : "-"}
                  </p>
                  {product?.diskon > 0 && (
                    <>
                      <p className="text-xs text-slate-400 line-through">
                        Rp {product?.harga_rupiah?.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-emerald-300">
                        Total discount: {effectiveDiscount}%
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between bg-slate-900/60 border border-slate-700/60 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-slate-400">
                      {t("payment_expire_title")}
                    </p>
                    <p className="text-sm text-slate-300">
                      {t("payment_expire_subtitle")}
                    </p>
                  </div>
                  <div className="text-2xl font-mono font-semibold text-white">
                    {formatTime(remainingSeconds)}
                  </div>
                </div>

                {isExpired && (
                  <p className="text-sm text-red-400 text-center">
                    {t("payment_expire_message")}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    disabled={!snapUrl || isExpired}
                    onClick={() => {
                      if (!snapUrl || isExpired) return;
                      window.open(snapUrl, "_blank");
                    }}
                  >
                    {t("payment_go_to_gateway")}
                  </Button>

                  <Button
                    variant="outline"
                    className="sm:w-auto border-slate-600 text-black hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                    onClick={() => navigate(-1)}
                  >
                    {t("payment_back")}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
}
