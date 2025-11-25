import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import Navbar from "../../components/navbar";
import { Footer } from "../../components/Footer";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const searchParams = new URLSearchParams(location.search);
  const orderId =
    searchParams.get("merchantOrderId") ||
    searchParams.get("orderId") ||
    "-";
  const resultCode = searchParams.get("resultCode") || "Unknown";

  const currentPage = "/payment";

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={navigate} languange={() => {}} />

      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-slate-800/90 border-red-500/60 p-8 shadow-2xl text-center flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/50">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">
                  {t("payment_failed_title")}
                </h1>
                <p className="text-red-300 text-sm md:text-base">
                  {t("payment_failed_subtitle")}
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
              {t("payment_failed_desc")}
            </p>

            <div className="mt-2 bg-slate-900/70 border border-slate-700/70 rounded-lg px-4 py-3 w-full max-w-md mx-auto text-left space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  {t("payment_order_label")}
                </p>
                <p className="text-sm text-slate-100 font-mono break-all">
                  {orderId}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">
                  Result Code
                </p>
                <p className="text-sm text-red-300 font-mono">
                  {resultCode}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md mx-auto">
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                onClick={() => navigate("/product")}
              >
                {t("payment_back_products")}
              </Button>

              <Button
                variant="outline"
                className="sm:w-auto border-slate-600 text-slate-200 flex items-center justify-center gap-2"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
                {t("payment_back_home")}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </>
  );
}
