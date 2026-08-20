import Link from "next/link";
import { ArrowLeftIcon } from "./ArrowLeftIcon";

export function BackHomeLink() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary dark:text-white/80 hover:text-primary-dark dark:hover:text-white transition mb-4"
    >
      <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.4} />
      Inicio
    </Link>
  );
}
