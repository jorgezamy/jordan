export function getFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado.";
    case "auth/invalid-email":
      return "Correo electrónico inválido.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera unos minutos e intenta de nuevo.";
    case "auth/network-request-failed":
      return "Sin conexión a internet. Revisa tu red e intenta de nuevo.";
    case "auth/user-disabled":
      return "Esta cuenta fue deshabilitada.";
    default:
      return "Ocurrió un error. Intenta de nuevo.";
  }
}
