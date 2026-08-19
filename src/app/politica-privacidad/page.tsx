import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Política de privacidad — Centro Cristiano Jordán",
  description: "Cómo el Centro Cristiano Jordán recopila, usa y protege tu información.",
};

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-primary dark:text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function PoliticaPrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 my-10">
      <div className="bg-white dark:bg-surface-dark shadow-lg rounded-xl p-5 sm:p-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-white mb-2">
            Política de privacidad
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Última actualización: agosto de 2026
          </p>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          Esta política explica qué información recopila el sitio y la aplicación
          del Centro Cristiano Jordán, para qué se usa y cómo la protegemos.
          Al usar el sitio web o la aplicación aceptas las prácticas descritas aquí.
        </p>

        <PolicySection title="Información que recopilamos">
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Peticiones de oración:</span>{" "}
              el nombre que escribas (o &quot;Anónimo&quot; si eliges no compartirlo), el
              texto de tu petición y, si tú decides dejarlos, tu teléfono y/o correo.
              El teléfono y correo son opcionales y se usan únicamente para que un
              pastor pueda darle seguimiento personal a tu petición.
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Cuentas de administrador:</span>{" "}
              si te registras como miembro del equipo pastoral, guardamos tu correo
              electrónico y contraseña (gestionados de forma segura por Firebase
              Authentication; nunca vemos ni guardamos tu contraseña en texto plano).
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Sesión anónima:</span>{" "}
              todo visitante recibe automáticamente una sesión anónima técnica
              (sin datos personales) que usamos únicamente para permitir el acceso
              a la base de datos del sitio.
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Notificaciones push:</span>{" "}
              si activas las notificaciones, tu dispositivo recibe un identificador
              (token) que usamos exclusivamente para avisarte cuando se publique una
              petición de oración nueva. Puedes desactivarlas en cualquier momento
              desde la configuración de tu navegador o de tu dispositivo.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="Cómo usamos tu información">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Usamos esta información únicamente para operar la función de peticiones
            de oración: mostrar las peticiones en el sitio, permitir que el equipo
            pastoral les dé seguimiento, y avisarte de peticiones nuevas si activaste
            las notificaciones. No usamos tus datos con fines publicitarios ni los
            vendemos ni compartimos con terceros para ese propósito.
          </p>
        </PolicySection>

        <PolicySection title="Con quién compartimos información">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Usamos los siguientes proveedores para operar el sitio, quienes procesan
            datos en nuestro nombre bajo sus propias políticas de privacidad:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Google Firebase / Google Cloud:</span>{" "}
              almacenamiento de datos (Firestore), autenticación y envío de
              notificaciones push.
            </li>
            <li>
              <span className="font-medium text-gray-800 dark:text-gray-100">Resend:</span>{" "}
              envío del correo de restablecimiento de contraseña a cuentas de
              administrador.
            </li>
          </ul>
        </PolicySection>

        <PolicySection title="Cuánto tiempo conservamos tu información">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Las peticiones pendientes permanecen visibles hasta que se marcan como
            resueltas o se cancelan. Las peticiones resueltas se muestran
            públicamente durante 1 mes; las canceladas solo son visibles para el
            equipo pastoral durante 2 semanas. Después de esos periodos dejan de
            mostrarse en el sitio, aunque el equipo pastoral puede eliminarlas de
            forma permanente en cualquier momento.
          </p>
        </PolicySection>

        <PolicySection title="Tus derechos">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Puedes solicitarnos en cualquier momento que corrijamos o eliminemos tu
            petición de oración o tu cuenta de administrador. Escríbenos por
            WhatsApp o a través de nuestras redes sociales y atenderemos tu
            solicitud lo antes posible.
          </p>
        </PolicySection>

        <PolicySection title="Contacto">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            ¿Tienes preguntas sobre esta política o sobre tus datos?{" "}
            <a
              href="https://wa.me/524425813349"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary dark:text-white underline hover:text-primary-dark hover:dark:text-white/80"
            >
              Escríbenos por WhatsApp
            </a>
            .
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
