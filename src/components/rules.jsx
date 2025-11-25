import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { useTranslation } from "react-i18next";
import {
  Search,
  MousePointerClick,
  ShoppingCart,
  MessageCircle,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "./ui/badge";

const steps = [
  {
    number: 1,
    icon: Search,
    titleKey: "rules_step1_title",
    descKey: "rules_step1_desc",
    detailsKeys: ["rules_step1_d1", "rules_step1_d2", "rules_step1_d3"],
    gradient: "from-blue-600 to-cyan-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    number: 2,
    icon: MousePointerClick,
    titleKey: "rules_step2_title",
    descKey: "rules_step2_desc",
    detailsKeys: ["rules_step2_d1", "rules_step2_d2", "rules_step2_d3"],
    gradient: "from-purple-600 to-pink-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    number: 3,
    icon: ShoppingCart,
    titleKey: "rules_step3_title",
    descKey: "rules_step3_desc",
    detailsKeys: ["rules_step3_d1", "rules_step3_d2"],
    gradient: "from-orange-600 to-red-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    number: 4,
    icon: MessageCircle,
    titleKey: "rules_step4_title",
    descKey: "rules_step4_desc",
    detailsKeys: ["rules_step4_d1", "rules_step4_d2"],
    gradient: "from-green-600 to-emerald-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    iconColor: "text-green-400",
  },
  {
    number: 5,
    icon: CreditCard,
    titleKey: "rules_step5_title",
    descKey: "rules_step5_desc",
    detailsKeys: ["rules_step5_d1", "rules_step5_d2", "rules_step5_d3"],
    gradient: "from-yellow-600 to-orange-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
];

export function HowToBuy({ lang }) {
  const [expandedStep, setExpandedStep] = useState(null);
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  return (
    <section className="relative min-h-screen py-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply blur-2xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply blur-2xl animate-pulse delay-700" />
      </div>

      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-white mb-2 text-xl sm:text-2xl md:text-3xl font-semibold">
            {t("rules_title")}
          </h1>
          <p className="text-blue-200 max-w-xl mx-auto text-sm sm:text-base">
            {t("rules_subtitle")}
          </p>
        </div>

        <div className="space-y-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isExpanded = expandedStep === index;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative">
                {!isLast && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-transparent hidden md:block" />
                )}

                <Card
                  className={`bg-slate-800/90 backdrop-blur-md border-slate-700/50 transition-all cursor-pointer ${
                    isExpanded ? "shadow-2xl shadow-blue-500/20" : "shadow-lg"
                  }`}
                  onClick={() => setExpandedStep(isExpanded ? null : index)}
                >
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col sm:flex-row items-start gap-5">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div
                          className={`relative w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <Icon className="h-9 w-9 text-white" />
                          <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                            <span className="text-slate-900 font-semibold">
                              {step.number}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-white mb-2 text-lg flex items-center gap-2">
                              {t(step.titleKey)}
                              <Badge
                                className={`bg-gradient-to-r ${step.gradient} border-0`}
                              >
                                Step {step.number}
                              </Badge>
                            </h3>
                            <p className="text-gray-300 text-sm sm:text-base">
                              {t(step.descKey)}
                            </p>
                          </div>
                          <ArrowRight
                            className={`h-10 w-10 md:h-5 md:w-5 text-blue-400 transition-transform duration-300 ml-3 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        </div>

                        <div
                          className={`transition-all duration-500 overflow-hidden ${
                            isExpanded
                              ? "max-h-80 opacity-100 mt-5"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div
                            className={`${step.bgColor} backdrop-blur-sm border ${step.borderColor} rounded-xl p-5`}
                          >
                            <h4 className="text-white mb-3 flex items-center gap-2 text-sm sm:text-base">
                              <CheckCircle
                                className={`h-5 w-5 ${step.iconColor}`}
                              />
                              {t("rules_detail_title")}
                            </h4>
                            <ul className="space-y-2 text-sm">
                              {step.detailsKeys.map(
                                (detailKey, detailIndex) => (
                                  <li
                                    key={detailIndex}
                                    className="flex items-start gap-2 text-gray-300"
                                  >
                                    <div
                                      className={`w-1.5 h-1.5 ${step.iconColor} rounded-full mt-1`}
                                    />
                                    <span>{t(detailKey)}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-10">
          <Card className="bg-blue-500/10 backdrop-blur-xl border-blue-500/30 p-5 sm:p-6">
            <h3 className="text-white mb-3 flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Tips Pembelian Aman
            </h3>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Pastikan Anda telah melihat detail akun sebelum membeli
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Selalu konfirmasi ke admin resmi
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                Simpan bukti pembayaran
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}
