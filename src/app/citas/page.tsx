import type { Metadata } from "next";
import { BackHomeLink } from "../../components/ui/BackHomeLink";
import GestionCitas from "../../components/citaBiblica/GestionCitas";

export const metadata: Metadata = {
  title: "Gestionar Citas Bíblicas",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-3xl mx-auto mb-2">
        <BackHomeLink />
      </div>
      <GestionCitas />
    </main>
  );
}
