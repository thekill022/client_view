import { FAQ } from "../../components/FAQ";
import { Footer } from "../../components/Footer";
import { MarqueeConnector } from "../../components/marqueeConnector";
import Navbar from "../../components/navbar";
import { PromoBanner } from "../../components/promoBanner";
import { PromoCarousel } from "../../components/promoCarousel";
import { WhyChoose } from "../../components/whyChoose";
import { ContactUs } from "../../components/contactUs";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const route = useLocation();
  const router = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("lang") || "my");
  const [hasBanners, setHasBanners] = useState(true); // asumsi ada banner

  useEffect(() => {
    // check apakah ada banner highlight
    fetch("http://localhost:3000/api/banner/highlight")
      .then((res) => res.json())
      .then((data) => {
        setHasBanners(data.data && data.data.length > 0);
      })
      .catch(() => setHasBanners(false));
  }, []);

  return (
    <>
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
      <Footer />
      <ContactUs />
    </>
  );
}
