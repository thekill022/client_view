import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useTranslation } from "react-i18next";

const faqs = [
  { questionKey: "faq_q1", answerKey: "faq_a1" },
  { questionKey: "faq_q2", answerKey: "faq_a2" },
  { questionKey: "faq_q3", answerKey: "faq_a3" },
  { questionKey: "faq_q4", answerKey: "faq_a4" },
];

export function FAQ() {
  const { t } = useTranslation("common");

  return (
    <section className="relative z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/images/bg-faq.png')] bg-cover bg-no-repeat bg-top min-h-[520px]" />

      <div className="relative z-10 py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <img src="/assets/images/faq-text.png" />
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gradient-to-r from-gray-300 to-white rounded-lg hover:border-blue-500 transition-colors duration-300 overflow-hidden"
            >
              <AccordionTrigger className="text-black font-bold hover:text-blue-600 hover:no-underline">
                <div className="px-4">{t(faq.questionKey)}</div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-200 bg-[#11309e] w-full">
                <div className="p-2 px-4 text-justify">{t(faq.answerKey)}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
