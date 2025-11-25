import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Footer } from "../../components/Footer";
import { Product } from "../../components/produtcs";
import { useState } from "react";

export default function Products() {
  const route = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "my");

  return (
    <>
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
    </>
  );
}
