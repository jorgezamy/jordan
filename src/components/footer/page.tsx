import Link from "next/link";
import { LocationIcon } from "../ui/LocationIcon";
import { CHURCH_ADDRESS, CHURCH_MAPS_URL } from "./constants";

export const FooterPage = () => {
  return (
    <footer className="border-t border-primary/10 dark:border-white/10">
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <a
          href={CHURCH_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 underline underline-offset-2 hover:text-accent dark:hover:text-accent transition"
        >
          <LocationIcon className="w-4 h-4 shrink-0 text-accent" />
          <span>{CHURCH_ADDRESS}</span>
        </a>

        <Link
          href="/politica-privacidad"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-white transition underline underline-offset-2"
        >
          Política de privacidad
        </Link>
      </div>
    </footer>
  );
};
