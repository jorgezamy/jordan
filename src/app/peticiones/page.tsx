import { BackHomeLink } from "../../components/ui/BackHomeLink";
import Peticiones from "../../components/peticiones/peticiones";

export default function Page() {
  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-3xl mx-auto mb-2">
        <BackHomeLink />
      </div>
      <Peticiones />
    </main>
  );
}
