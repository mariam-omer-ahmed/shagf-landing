import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 shrink-0" aria-label="Shaghaf">

      <Image
        src={logo}
        alt="Shaghaf Logo"
        width={32}
        height={32}
      />

      <span className="text-sm font-semibold text-gray-100">
        شغف
      </span>

    </Link>
  );
}