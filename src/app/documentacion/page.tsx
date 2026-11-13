import type { Metadata } from "next";
import { Documentacion } from "../../components/documentacion/Documentacion";
import { BackHomeLink } from "../../components/ui/BackHomeLink";

export const metadata: Metadata = {
  title: "Documentación",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-3xl mx-auto mb-2">
        <BackHomeLink />
      </div>
      <Documentacion />
    </main>
  );
}
