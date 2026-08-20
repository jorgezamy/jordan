import { BackHomeLink } from "../../components/ui/BackHomeLink";
import GestionCitas from "../../components/citaBiblica/GestionCitas";

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
