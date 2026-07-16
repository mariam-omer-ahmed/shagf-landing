import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo1.jpeg";

export default function Logo() {
  return (
    <Link
      href="/"
      className="
      flex
      items-center
      gap-4
      shrink-0
      "
      aria-label="Shaghaf"
    >
      <div
        className="
        overflow-hidden
        rounded-2xl
        border
        border-pink-100
        bg-white
        p-1
        shadow-sm
        "
      >
        <Image
          src={logo}
          alt="Shaghaf Logo"
          width={52}
          height={52}
          className="rounded-xl object-cover"
        />
      </div>

      <div className="hidden sm:block">
        <h2 className="text-xl font-black text-black">
          شغف
        </h2>

        <p className="text-xs text-gray-500">
          Career Growth Platform
        </p>
      </div>
    </Link>
  );
}