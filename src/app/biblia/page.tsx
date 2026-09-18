import type { Metadata } from "next";
import { BackHomeLink } from "../../components/ui/BackHomeLink";
import { LectorBiblia } from "../../components/biblia/LectorBiblia";

export const metadata: Metadata = {
  title: "Biblia",
  description:
    "Lee la Biblia completa en línea — navega por libro, capítulo y versión, y copia versículos o pasajes.",
  alternates: { canonical: "/biblia" },
};

export default function Page() {
  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-3xl mx-auto mb-2">
        <BackHomeLink />
      </div>
      <LectorBiblia />
    </main>
  );
}
