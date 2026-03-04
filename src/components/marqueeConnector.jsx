import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config/api";
import {
  FaBullhorn,
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaFire,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const iconMap = {
  bullhorn: FaBullhorn,
  warning: FaExclamationCircle,
  success: FaCheckCircle,
  info: FaInfoCircle,
  hot: FaFire,
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
};

export function MarqueeConnector() {
  const { t } = useTranslation("common");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch(getApiUrl("/api/pengumuman"))
      .then((res) => res.json())
      .then((data) => {
        const highlighted = (data.data || [])
          .filter((a) => a.highlight)
          .map((a) => ({
            html: a.pengumuman,
            icon: a.icon || null,
            icon_position: a.icon_position || "start",
          }));
        setAnnouncements(highlighted);
      })
      .catch((err) => {
        console.error("Failed to fetch announcements", err);
        setAnnouncements([]);
      });
  }, []);

  const defaultMessages = [
    t("marquee_hot_deals"),
    t("marquee_fast_secure"),
    t("marquee_premium"),
    t("marquee_best_price"),
    t("marquee_trusted"),
    t("marquee_special"),
  ];

  const items =
    announcements.length > 0
      ? announcements
      : defaultMessages.map((msg) => ({
          html: msg,
          icon: null,
          icon_position: "start",
        }));

  const renderIcon = (iconName, position) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName] || FaBullhorn;
    return (
      <IconComponent className="text-xl md:text-2xl flex-shrink-0 text-white drop-shadow-lg" />
    );
  };

  const renderContent = (item) => {
    const shouldShowStart =
      item.icon_position === "start" || item.icon_position === "both";
    const shouldShowEnd =
      item.icon_position === "end" || item.icon_position === "both";

    // Jika teks biasa tanpa HTML
    if (typeof item.html === "string" && !item.html.includes("<")) {
      return (
        <span className="text-lg md:text-xl gaming-text text-white/90 drop-shadow-lg">
          🔥 {item.html}
        </span>
      );
    }

    // Render HTML dengan class untuk styling via CSS
    return (
      <div className="flex items-center gap-2 md:gap-4">
        {shouldShowStart && renderIcon(item.icon, "start")}

        <div
          className="marquee-announcement text-lg md:text-xl"
          style={{ fontFamily: "'Rajdhani', sans-serif", color: "white" }}
          dangerouslySetInnerHTML={{ __html: item.html }}
        />

        {shouldShowEnd && renderIcon(item.icon, "end")}
      </div>
    );
  };

  return (
    <div className="relative py-2 bg-[#0b0530] border-1 border-x-0 border-white overflow-hidden">
      {/* Shimmer Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="relative flex animate-marquee whitespace-nowrap">
        {/* 2 set duplikat konten untuk seamless infinite scroll */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center gap-10 md:gap-16 px-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 text-white">
                {renderContent(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
