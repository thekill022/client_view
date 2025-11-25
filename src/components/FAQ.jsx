import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useTranslation } from "react-i18next";

const faqs = [
  {
    questionKey: "faq_q1",
    answerKey: "faq_a1",
  },
  {
    questionKey: "faq_q2",
    answerKey: "faq_a2",
  },
  {
    questionKey: "faq_q3",
    answerKey: "faq_a3",
  },
  {
    questionKey: "faq_q4",
    answerKey: "faq_a4",
  },
];

export function FAQ() {
  const { t } = useTranslation("common");

  return (
    <section className="py-16 bg-gradient-to-br bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 mb-3">{t("faq_title")}</h2>
          <p className="text-white">{t("faq_subtitle")}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gray-800 border-2 border-gray-200 rounded-lg px-6 hover:border-blue-500 transition-colors duration-300"
            >
              <AccordionTrigger className="text-white hover:text-blue-600 hover:no-underline">
                {t(faq.questionKey)}
              </AccordionTrigger>
              <AccordionContent className="text-gray-200">
                {t(faq.answerKey)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
