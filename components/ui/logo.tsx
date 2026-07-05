import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo1.jpeg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 shrink-0" aria-label="Shaghaf">

      <Image
        src={logo}
        alt="Shaghaf Logo"
        width={80}
        height={80}
      />


    </Link>
  );
}