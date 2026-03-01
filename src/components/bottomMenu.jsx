import { GoHomeFill } from "react-icons/go";
import { FiGrid } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
import { FiMessageCircle } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function BottomMenu() {
  const route = useLocation();

  return (
    <div className="sticky lg:hidden bottom-0 w-full bg-[#09052b] z-999999 py-2 flex justify-around px-2 border-t-3 border-white">
      <a
        href="/"
        className={`flex flex-col justify-center items-center ${
          route.pathname === "/" ? "text-blue-600" : "text-white"
        }`}
      >
        <GoHomeFill
          className={` ${
            route.pathname === "/" ? "fill-blue-600" : "fill-white"
          } text-sm`}
        />
        <div className="text-sm">BERANDA</div>
      </a>
      <a
        href="https://merzzofficial.com/id"
        className="flex flex-col justify-center items-center text-white"
      >
        <FiGrid className="fill-white text-sm rotate-45" />
        <div className="text-sm">TOPUP</div>
      </a>
      <a
        href="/product"
        className={`flex flex-col justify-center items-center ${
          route.pathname === "/product" ? "text-blue-600" : "text-white"
        }`}
      >
        <FiFolder
          className={`${
            route.pathname === "/product" ? "fill-blue-600" : "fill-white"
          } text-sm`}
        />
        <div className="text-sm">BELI AKUN</div>
      </a>
      <a
        href="/joki"
        className={`flex flex-col justify-center items-center ${
          route.pathname === "/joki" ? "text-blue-600" : "text-white"
        }`}
      >
        <svg
          width="253"
          height="254"
          viewBox="0 0 253 254"
          stroke="currentColor"
          fill={route.pathname === "/joki" ? "#2563eb" : "white"}
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 ${route.pathname === "/joki" ? "text-blue-600" : "text-white"}`}
        >
          <path
            d="M55.5 132.09V184.09L126.5 148.09L196.5 183.09V132.59L126.5 92.5899L55.5 132.09Z"
            fill="currentColor"
            stroke="currentColor"
          />
          <path
            d="M55.5 200.59V252.59L126.5 216.59L196.5 251.59V201.09L126.5 161.09L55.5 200.59Z"
            fill="currentColor"
            stroke="currentColor"
          />
          <path
            d="M0.5 80.5899V146.59L126 73.5899L252 149.09V78.0899L125.5 0.58992L0.5 80.5899Z"
            fill="currentColor"
            stroke="currentColor"
          />
        </svg>
        <div className="text-sm">JOKI</div>
      </a>
      <a
        href="https://api.whatsapp.com/send?phone=601164498139"
        className="flex flex-col justify-center items-center text-white"
      >
        <FiMessageCircle className="fill-white text-sm" />
        <div className="text-sm">CHAT CS</div>
      </a>
    </div>
  );
}
