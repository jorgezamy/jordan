import { Alert } from "../ui/Alert";
import { Button } from "../ui/Button";
import { FieldLabel } from "../ui/FieldLabel";
import { MENSAJE_MAX_LEN } from "./constants";
import { useAlertas } from "./useAlertas";

interface AlertaFormProps {
  form: ReturnType<typeof useAlertas>;
  mensajeExito: string;
}

export function AlertaForm({ form, mensajeExito }: AlertaFormProps) {
  const { mensaje, setMensaje, enviando, error, enviar } = form;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Mensaje</FieldLabel>
        <textarea
          value={mensaje}
          maxLength={MENSAJE_MAX_LEN}
          rows={4}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe el mensaje que se enviará como notificación..."
          className="w-full outline-none transition-colors border-2 border-primary/40 dark:border-white/40 bg-gray-50 dark:bg-white/5 shadow-sm focus:border-primary focus:dark:border-white focus:ring-2 focus:ring-primary focus:dark:ring-white rounded-lg px-3 py-2 text-gray-800 dark:text-gray-100"
        />
      </div>

      {error && (
        <Alert variant="danger" className="p-3">
          {error}
        </Alert>
      )}

      {mensajeExito && (
        <Alert variant="success" className="p-3">
          {mensajeExito}
        </Alert>
      )}

      <Button onClick={enviar} disabled={enviando || !mensaje.trim()} className="py-2 rounded-lg font-medium">
        {enviando ? "ENVIANDO..." : "LANZAR NOTIFICACIÓN"}
      </Button>
    </div>
  );
}
