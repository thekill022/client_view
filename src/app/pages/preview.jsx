import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/navbar";
import { ProductPreview } from "../../components/productPreview";
import { useState } from "react";

export default function Preview() {
  const route = useLocation();
  const router = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ms");
  const { id } = useParams();

  return (
    <div className="bg-[url('/assets/images/bg-merzz.png')] bg-cover bg-center">
      <Navbar
        currentPage={route.pathname}
        onNavigate={(pages) => {
          router(`${pages}`);
        }}
        languange={(bahasa) => {
          setLang(bahasa);
        }}
      />
      <ProductPreview lang={lang} id={id} />
      <Footer />
    </div>
  );
}
