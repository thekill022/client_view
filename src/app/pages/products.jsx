import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Footer } from "../../components/Footer";
import { Product } from "../../components/produtcs";
import { useState } from "react";
import BottomMenu from "../../components/bottomMenu";

export default function Products() {
  const route = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ms");

  return (
    <div className="bg-[url('/assets/images/bg-merzz.png')] bg-cover bg-center">
      <Navbar
        currentPage={route.pathname}
        onNavigate={(pages) => {
          navigate(pages);
        }}
        languange={(bahasa) => {
          setLang(bahasa);
        }}
      />
      <Product lang={lang} />
      <Footer />
      <BottomMenu />
    </div>
  );
}
