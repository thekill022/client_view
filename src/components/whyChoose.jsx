import {
  Shield,
  Zap,
  HeadphonesIcon,
  Award,
  CreditCard,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useTranslation } from "react-i18next";

const features = [
  {
    icon: Shield,
    titleKey: "why_secure_title",
    descriptionKey: "why_secure_desc",
  },
  {
    icon: Zap,
    titleKey: "why_instant_title",
    descriptionKey: "why_instant_desc",
  },
  {
    icon: HeadphonesIcon,
    titleKey: "why_support_title",
    descriptionKey: "why_support_desc",
  },
  {
    icon: Award,
    titleKey: "why_verified_title",
    descriptionKey: "why_verified_desc",
  },
  {
    icon: CreditCard,
    titleKey: "why_payment_title",
    descriptionKey: "why_payment_desc",
  },
  {
    icon: Clock,
    titleKey: "why_price_title",
    descriptionKey: "why_price_desc",
  },
];

export function WhyChoose() {
  const { t } = useTranslation("common");

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 mb-3">{t("why_title")}</h2>
          <p className="text-white max-w-2xl mx-auto">
            {t("why_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
                      <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-white">{t(feature.titleKey)}</h3>
                    <p className="text-gray-400">{t(feature.descriptionKey)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
