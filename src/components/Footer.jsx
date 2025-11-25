import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation("common");
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                Merz Store
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {t("footer_desc")}
              </p>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-gray-500 mb-3">{t("footer_follow_us")}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/50"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-800/50 hover:bg-gradient-to-r hover:from-sky-600 hover:to-sky-500 transition-all duration-300 border border-slate-700/50 hover:border-sky-500/50"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-800/50 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 transition-all duration-300 border border-slate-700/50 hover:border-pink-500/50"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-slate-800/50 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 transition-all duration-300 border border-slate-700/50 hover:border-red-500/50"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-6">{t("footer_quick_links")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                  {t("home")}
                </a>
              </li>
              <li>
                <a
                  href="/product"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                  {t("products")}
                </a>
              </li>
              <li>
                <a
                  href="/rules"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-2" />
                  {t("how")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white mb-6">{t("footer_contact_support")}</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@merzstore.com"
                  className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-600/20 transition-colors duration-300 border border-slate-700/50 group-hover:border-blue-500/50">
                    <Mail className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("email")}</p>
                    <p className="text-gray-300">support@merzstore.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="tel:+6281234567890"
                  className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-600/20 transition-colors duration-300 border border-slate-700/50 group-hover:border-blue-500/50">
                    <Phone className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="text-gray-300">+62 812-3456-7890</p>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/merz_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-pink-400 transition-colors duration-300 group"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-pink-600/20 transition-colors duration-300 border border-slate-700/50 group-hover:border-pink-500/50">
                    <Instagram className="h-5 w-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Instagram</p>
                    <p className="text-gray-300">@merz_store</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t("location")}</p>
                    <p className="text-gray-300">Kuala Lumpur, Malaysia</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 w-full text-sm text-center md:text-center">
              {t("footer_copy")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
