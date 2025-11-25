import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resultCode = searchParams.get("resultCode");
    const merchantOrderId = searchParams.get("merchantOrderId");
    const reference = searchParams.get("reference");

    // resultCode "00" = sukses, selain itu = gagal
    if (resultCode === "00") {
      navigate(`/payment/success?merchantOrderId=${merchantOrderId}&reference=${reference}`, {
        replace: true,
      });
    } else {
      navigate(`/payment/failed?merchantOrderId=${merchantOrderId}&reference=${reference}&resultCode=${resultCode}`, {
        replace: true,
      });
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Processing payment result...</p>
      </div>
    </div>
  );
}
