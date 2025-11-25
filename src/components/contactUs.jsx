import { useState } from "react";
import { MessageCircle, X, Mail, Phone, Instagram, Send } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function ContactUs() {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);

  const contactOptions = [
    {
      icon: Phone,
      label: "WhatsApp",
      href: "https://wa.me/6281234567890",
      color: "from-green-500 to-green-600",
      hoverColor: "hover:shadow-green-500/50",
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/merz_store",
      color: "from-pink-500 via-purple-500 to-orange-500",
      hoverColor: "hover:shadow-pink-500/50",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:support@merzstore.com",
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:shadow-blue-500/50",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Contact Options - Appear when open */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <a
                key={option.label}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-3 bg-white rounded-full shadow-lg hover:shadow-xl ${option.hoverColor} transition-all duration-300 pr-5 pl-4 py-3 animate-in slide-in-from-right-4 border border-gray-100`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div
                  className={`p-2 rounded-full bg-gradient-to-r ${option.color} shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className="gaming-text whitespace-nowrap text-gray-700 group-hover:text-gray-900">
                  {option.label}
                </span>
              </a>
            );
          })}
        </div>
      )}

      {/* Main Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative group">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-ping opacity-75" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-75 blur-lg group-hover:blur-xl transition-all duration-300" />

        {/* Button content */}
        <div className="relative flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110">
          {isOpen ? (
            <X className="h-7 w-7 text-white transition-transform duration-300 rotate-90" />
          ) : (
            <MessageCircle className="h-7 w-7 text-white transition-transform duration-300" />
          )}
        </div>

        {/* Label on hover */}
        {!isOpen && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap gaming-text flex items-center gap-2">
              <Send className="h-4 w-4" />
              {t("contact_us")}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-0 h-0 border-l-8 border-l-gray-900 border-y-4 border-y-transparent" />
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
