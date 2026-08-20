import Link from "next/link";

export const FooterPage = () => {
  return (
    <footer className="py-6 text-center">
      <Link
        href="/politica-privacidad"
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 hover:dark:text-white transition underline"
      >
        Política de privacidad
      </Link>
    </footer>
  );
};
