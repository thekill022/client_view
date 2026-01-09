import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { HowToBuy } from "../../components/rules";
import { Footer } from "../../components/Footer";
import { useEffect, useState } from "react";

export default function Rules() {
  const route = useLocation();
  const router = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ms");

  useEffect(() => {
    console.log(route.pathname);
  }, []);

  return (
    <>
      <Navbar
        currentPage={route.pathname}
        onNavigate={(pages) => {
          router(`${pages}`);
        }}
        languange={(bahasa) => {
          setLang(bahasa);
        }}
      />
      <HowToBuy lang={lang} />
      <Footer />
    </>
  );
}
