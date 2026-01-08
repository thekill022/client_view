import { useTranslation } from "react-i18next";

export function WhyChoose({ lang, classname = "" }) {
  const { t } = useTranslation("common");

  return (
    <section className={`py-30 pt-4 ${classname}`}>
      <div className="mx-auto">
        {/* GRADIENT BORDER */}
        <div className="rounded-2xl bg-gradient-to-b from-blue-700 to-blue-400 p-[1px]">
          {/* CONTENT */}
          <div class="grid grid-cols-2 md:grid-cols-4 text-white text-center rounded py-3">
            <div class="relative flex flex-col items-center justify-center p-3">
              <img src="/assets/images/jam.png" className="w-10" />
              <span className="font-medium text-md">{t("layan")}</span>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "25%",
                  height: "50%",
                  width: "2px",
                  backgroundColor: "white",
                }}
              ></div>
              <div class="absolute right-0 top-1/2 hidden md:block h-8 w-px -translate-y-1/2 bg-white/40"></div>
            </div>

            <div class="relative flex flex-col items-center justify-center p-3">
              <img src="/assets/images/petir.png" className="w-10" />
              <span className="font-medium text-md">{t("proses")}</span>
              <div
                class="hidden md:block"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "25%",
                  height: "50%",
                  width: "2px",
                  backgroundColor: "white",
                }}
              ></div>
            </div>

            <div class="relative flex flex-col items-center justify-center p-3">
              <img src="/assets/images/shield.png" className="w-10" />
              <span className="font-medium text-md">{t("bayar")}</span>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "25%",
                  height: "50%",
                  width: "2px",
                  backgroundColor: "white",
                }}
              ></div>
              <div class="absolute right-0 top-1/2 hidden md:block h-8 w-px -translate-y-1/2 bg-white/40"></div>
            </div>

            <div class="flex flex-col items-center justify-center p-3">
              <img src="/assets/images/atm.png" className="w-10 lg:pt-4" />
              <span className="font-medium text-md">{t("jaminan")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
