import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getApiUrl } from "../config/api";

export function MarqueeConnector() {
  const { t } = useTranslation("common");
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch(getApiUrl("/api/pengumuman"))
      .then((res) => res.json())
      .then((data) => {
        const items = (data.data || [])
          .filter((a) => a.highlight)
          .map((a) => a.pengumuman);
        setAnnouncements(items);
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

  const messages = announcements.length > 0 ? announcements : defaultMessages;

  return (
    <div className="relative py-4 bg-[#0b0530] border-4 border-x-0 border-white overflow-hidden">
      {/* Animated Shimmer Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse" />

      {/* Scan Line Effect for Tech Vibe */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-blue-500/5" />

      <div className="relative flex animate-marquee whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-8">
            {messages.map((msg, idx) => (
              <span
                key={idx}
                className={`text-lg md:text-xl gaming-text ${
                  idx % 3 === 0
                    ? "text-white/90"
                    : idx % 3 === 1
                    ? "text-blue-300"
                    : "text-purple-300"
                }`}
              >
                {announcements.length > 0 ? "📢" : "🔥"} {msg}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
