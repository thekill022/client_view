import {
  Instagram,
  Send,
  MessageCircle,
  BadgeCheckIcon as BadgeCheck,
} from "lucide-react";

export default function Sosmed({ lang }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Social media section */}
      <a
        href="https://linktr.ee/merzzofficial.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-6 sm:mt-8 md:mt-12 mb-4"
      >
        <div className="relative bg-gradient-to-r from-[#007aff] via-[#00a8ff] to-[#007aff] rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 border-2 border-white/30 shadow-[0_0_15px_rgba(0,122,255,0.5)] hover:shadow-[0_0_25px_rgba(0,122,255,0.7)] transition-all duration-300 hover:scale-[1.02] group cursor-pointer overflow-hidden">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <div className="relative flex items-center justify-between gap-2 sm:gap-3 md:gap-4 min-h-[36px] sm:min-h-[48px] md:min-h-[56px]">
            {/* Ikon Sosial Media Kiri - DIKECILKAN DI MOBILE */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0 z-10">
              {/* Instagram - Mobile: 24px, sm: 32px, md: 40px, lg: 48px */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Instagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
              </div>

              {/* Telegram */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#0088cc] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
              </div>

              {/* WhatsApp */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#25d366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform overflow-hidden">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 object-contain"
                />
              </div>
            </div>

            {/* Teks Tengah - Absolute Perfect Center - PADDING DIKURANGIN DI MOBILE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-14 sm:px-20 md:px-24 lg:px-28">
              <h3 className="text-white font-black text-[10px] sm:text-sm md:text-lg lg:text-2xl xl:text-3xl italic uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] leading-tight text-center whitespace-nowrap">
                <span className="hidden sm:inline">
                  {lang === "en"
                    ? "OFFICIAL ACCOUNT"
                    : "SOSIAL MEDIA RESMI"}{" "}
                </span>
                <span className="sm:hidden">
                  {lang === "en" ? "OFFICIAL" : "SOSMED"}{" "}
                </span>
                <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                  MERZZ MLBB
                </span>
              </h3>
            </div>

            {/* Badge Verified Kanan - DIKECILKAN DI MOBILE */}
            <div className="shrink-0 z-10">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center">
                <BadgeCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white fill-[#007aff]" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
