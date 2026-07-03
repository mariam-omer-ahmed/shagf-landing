"use client";

import Link from "next/link";
import Logo from "./logo";

export default function Header() {
  return (
    <header className="z-30 mt-2 w-full md:mt-5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3">

          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <Link
                href="/signin"
                className="btn-sm text-gray-300 hover:text-white"
              >
                Sign In
              </Link>
            </li>

            <li>
              <Link
                href="/signup"
                className="btn-sm bg-linear-to-t from-[#E96B8A] to-pink-500 text-white shadow-[0_0_25px_rgba(233,107,138,0.3)] hover:opacity-90"
              >
                Register
              </Link>
            </li>
          </ul>

        </div>
      </div>
    </header>
  );
}