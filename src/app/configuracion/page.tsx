import type { Metadata } from "next";
import { BackHomeLink } from "../../components/ui/BackHomeLink";
import Configuracion from "../../components/settings/Configuracion";

export const metadata: Metadata = {
  title: "Configuración",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-2xl mx-auto mb-2">
        <BackHomeLink />
      </div>
      <Configuracion />
    </main>
  );
}
