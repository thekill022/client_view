import { FAQ } from "../../components/FAQ";
import { Footer } from "../../components/Footer";
import { MarqueeConnector } from "../../components/marqueeConnector";
import Navbar from "../../components/navbar";
import { PromoBanner } from "../../components/promoBanner";
import { PromoCarousel } from "../../components/promoCarousel";
import { WhyChoose } from "../../components/whyChoose";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getApiUrl } from "../../config/api";
import About from "../../components/about";

export default function Home() {
  const route = useLocation();
  const router = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "my");
  const [hasBanners, setHasBanners] = useState(true); // asumsi ada banner

  useEffect(() => {
    // check apakah ada banner highlight
    fetch(getApiUrl("/api/banner/highlight"))
      .then((res) => res.json())
      .then((data) => {
        setHasBanners(data.data && data.data.length > 0);
      })
      .catch(() => setHasBanners(false));
  }, []);

  return (
    <div className="bg-[url('/assets/images/bg-merzz.png')] bg-cover bg-center">
      <Navbar
        currentPage={route.pathname}
        onNavigate={(pages) => {
          router(pages);
        }}
        languange={(bahasa) => {
          setLang(bahasa);
        }}
      />
      <PromoBanner />
      {hasBanners && <MarqueeConnector />}
      <PromoCarousel lang={lang} />
      {!hasBanners && <MarqueeConnector />}
      <WhyChoose />
      <FAQ />
      <About />
      <Footer />
    </div>
  );
}
