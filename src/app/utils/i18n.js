import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "../locales/en/common.json";
import idCommon from "../locales/id/common.json";
import myCommon from "../locales/my/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: { common: enCommon },
      id: { common: idCommon },
      ms: { common: myCommon },
    },
  });

export default i18n;
