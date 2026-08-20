import { BackHomeLink } from "../../components/ui/BackHomeLink";
import Configuracion from "../../components/settings/Configuracion";

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
