"use client";

import { useAuth } from "../../context/AuthContext";
import { FESTIVOS } from "../festivos/constants";
import { CALENDARIO } from "../fondoAnimado/constants";
import { Alert } from "../ui/Alert";
import { DONDE_CAMBIAR } from "./constants";
import { ListaTitulos } from "./ListaTitulos";
import { TarjetaFestivo } from "./TarjetaFestivo";
import { TarjetaFondo } from "./TarjetaFondo";
import { TituloSeccion } from "./TituloSeccion";

export function Documentacion() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <Alert variant="danger" className="p-4">
          Esta sección es solo para administradores.
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Documentación</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Guía visual de las decoraciones que el sitio pone solo, según la fecha.
        </p>
      </div>

      <section>
        <TituloSeccion titulo="Fondos de temporada">
          Se activan solos según la fecha del dispositivo de cada visitante: detrás del contenido del inicio y dentro del
          header en todas las páginas. Fuera de estas fechas no se muestra nada. Si el dispositivo tiene activado
          &ldquo;reducir movimiento&rdquo;, tampoco se muestran.
        </TituloSeccion>
        <div className="grid gap-4 sm:grid-cols-2">
          {CALENDARIO.map((t) => (
            <TarjetaFondo key={t.efecto} temporada={t} />
          ))}
        </div>
      </section>

      <section>
        <TituloSeccion titulo="Íconos de días festivos">
          Aparecen junto al logo del header, en todas las páginas, solo durante ese día. En pantallas grandes también
          muestran el saludo.
        </TituloSeccion>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {FESTIVOS.map((f) => (
            <TarjetaFestivo key={f.nombre} festivo={f} />
          ))}
        </div>
      </section>

      <section>
        <TituloSeccion titulo="Títulos del inicio">
          Aparecen arriba de &ldquo;Dios te habla hoy&rdquo;. Si hoy es un día festivo se muestra su saludo; si no, el de la
          temporada. Fuera de estas fechas no se muestra ningún título.
        </TituloSeccion>
        <ListaTitulos />
      </section>

      <section>
        <TituloSeccion titulo="Dónde se cambia">
          Para quien mantiene el código. Para ver un día completo usa &ldquo;Probar decoraciones&rdquo; en el menú de Cuenta
          (simula la fecha con <code>?fecha=AAAA-MM-DD</code>). Los enlaces &ldquo;Ver en…&rdquo; de esta página usan{" "}
          <code>?fondo=</code>, <code>?festivo=</code> y <code>?celebracion=</code> para mostrar una sola pieza.
        </TituloSeccion>
        <dl className="overflow-hidden rounded-2xl border border-primary/15 dark:border-white/10 bg-white dark:bg-surface-dark divide-y divide-primary/10 dark:divide-white/10">
          {DONDE_CAMBIAR.map(({ que, donde }) => (
            <div key={que} className="p-3 sm:flex sm:gap-4">
              <dt className="text-sm font-medium text-gray-800 dark:text-gray-100 sm:w-56 sm:shrink-0">{que}</dt>
              <dd className="mt-0.5 sm:mt-0 text-xs font-[family-name:var(--font-geist-mono)] text-gray-600 dark:text-gray-400 break-all">
                {donde}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
