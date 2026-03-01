import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { Footer } from "../../components/Footer";
import { JokiSection } from "../../components/jokiSection";
import { useState } from "react";
import BottomMenu from "../../components/bottomMenu";

export default function JokiPage() {
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
            <div className="pt-8">
                <JokiSection lang={lang} />
            </div>
            <Footer />
            <BottomMenu />
        </div>
    );
}
