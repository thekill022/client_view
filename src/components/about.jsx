export default function About() {
  const stats = [
    { value: "1234567", label: "User Member" },
    { value: "1234567", label: "User Member" },
    { value: "1234567", label: "User Member" },
    { value: "1234567", label: "User Member" },
  ];

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 pt-16 -translate-y-6 relative z-10">
      <div className="flex justify-center">
        <div className="bg-[#172385] rounded-full p-2 mb-4">
          <img
            src="/assets/images/merzz-logo.png"
            className="w-30"
            alt="logo"
          />
        </div>
      </div>
      <p className=" text-xs md:text-sm text-center font-bold mb-10">
        Jual Beli Akun ML (Mobile Legends) & Game Lainnya Terlengkap, Aman, dan
        Terpercaya di MERZZMLBB! MERZZMLBB adalah pusat jual beli akun Mobile
        Legends dan akun game populer lainnya dengan sistem transaksi aman,
        anti-hackback, dan garansi 100% uang kembali. Temukan akun ML mulai dari
        entry-level hingga akun sultan dengan hero dan skin langka. Semua akun
        sudah diverifikasi sehingga bebas risiko. Wujudkan akun ML impianmu
        sekarang hanya di MERZZMLBB - marketplace akun game terpercaya di
        Indonesia!
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 px-0 justify-items-center mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="relative w-full max-w-[256px] h-32 flex flex-col items-center justify-center 
                 bg-gradient-to-b from-[#0a46ce] to-[#062c8a] 
                 text-white shadow-lg
                 rounded-tl-none rounded-tr-[40px] md:rounded-tr-[50px] 
                 rounded-bl-[40px] md:rounded-bl-[50px] rounded-br-none"
          >
            <h2 className="text-xl md:text-2xl font-bold tracking-wider italic mb-1">
              {stat.value}
            </h2>
            <p className="text-[6px] md:text-xs font-semibold uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
