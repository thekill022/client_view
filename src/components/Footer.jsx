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
    <footer className="relative text-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <img
                src="/assets/images/merzz-logo.png"
                alt="logo"
                className="mb-3"
              />
              <p className="text-gray-400 leading-relaxed">
                {t("footer_desc")}
              </p>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-yellow-300 font-bold">Kantor Pusat</p>
              <p className="text-white mb-4 font-bold">
                Kuala Lumpur, Malaysia
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-yellow-300 font-bold mb-3">CUSTOMER SERVICE</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <div className="flex gap-2 items-center">
                    <img src="/assets/images/tele.png" className="h-10 w-10" />
                    <span className="text-white font-bold">CS TopUp</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <div className="flex gap-2 items-center">
                    <img src="/assets/images/wa.png" className="h-10 w-10" />
                    <span className="text-white font-bold">CS TopUp</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 inline-flex items-center group"
                >
                  <div className="flex gap-2 items-center">
                    <img src="/assets/images/ig.png" className="h-10 w-10" />
                    <span className="text-white font-bold">CS TopUp</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-yellow-300 font-bold mb-3">SOCIAL MEDIA</p>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://wa.me/601164498139"
                  className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="flex gap-2 items-center">
                    <img src="/assets/images/wa.png" className="h-10 w-10" />
                    <span className="text-white font-bold">Whatsapp</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/merzz_mlbb/"
                  className="flex items-start gap-3 text-gray-400 hover:text-blue-400 transition-colors duration-300 group"
                >
                  <div className="flex gap-2 items-center">
                    <img src="/assets/images/ig.png" className="h-10 w-10" />
                    <span className="text-white font-bold">Instagram</span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-400 hover:text-pink-400 transition-colors duration-300 group"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      src="/assets/images/tiktok.png"
                      className="h-10 w-10"
                    />
                    <span className="text-white font-bold">Tiktok</span>
                  </div>
                </a>
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
