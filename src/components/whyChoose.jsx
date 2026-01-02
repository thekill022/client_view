import { useTranslation } from "react-i18next";

export function WhyChoose() {
  const { t } = useTranslation("common");

  return (
    <section className="py-30 pt-4">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GRADIENT BORDER */}
        <div className="rounded-2xl bg-gradient-to-b from-blue-700 to-blue-400 p-[3px]">
          {/* CONTENT */}
          <div className="w-full rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 px-6 py-8 text-white">
            <h2 className="mb-8 text-center text-xl font-extrabold md:text-2xl italic">
              WHY CHOOSE <span className="text-yellow-300">MERZZ</span> ?
            </h2>

            <div className="grid grid-cols-3 items-center justify-items-center gap-6 sm:gap-8 md:gap-12">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/assets/images/shield1.png"
                  alt="Proses Kilat"
                  className="mb-3 w-20 sm:w-24 md:w-28"
                />
                <p className="text-xs sm:text-sm font-bold md:text-base">
                  PROSES KILAT
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <img
                  src="/assets/images/shield2.png"
                  alt="Aman & Bergaransi"
                  className="mb-3 w-20 sm:w-24 md:w-28"
                />
                <p className="text-xs sm:text-sm font-bold md:text-base">
                  AMAN &amp; BERGARANSI
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <img
                  src="/assets/images/shield3.png"
                  alt="Terpercaya"
                  className="mb-3 w-20 sm:w-24 md:w-28"
                />
                <p className="text-xs sm:text-sm font-bold md:text-base">
                  TERPERCAYA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
