import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="flex justify-center border-t py-6 md:py-0 px-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex items-center gap-2 font-bold">
          <Link href="/" className="flex items-center gap-2">
            <Image
              priority
              alt="Goodspeech Logo"
              height={40}
              width={120}
              src="/logo.svg"
            />
          </Link>
        </div>
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          © 2025 Goodspeech. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/impress"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-50"
          >
            Impress
          </Link>
          <Link
            href="/dsgvo"
            className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-50"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
