// One-time migration: assigns an initial `orden` (posición de arrastre) to
// existing avisos, most recientes primero — el mismo orden que ya tenían
// por defecto en "Avisos publicados". A partir de aquí el admin controla el
// orden arrastrando en esa pantalla.
// Run: node --env-file=.env.local scripts/migrar-orden-avisos.js

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function migrar() {
  const snap = await db
    .collection("avisos")
    .orderBy("fechaCreacion", "desc")
    .get();

  if (snap.empty) {
    console.log("No hay avisos. Nada que migrar.");
    return;
  }

  const pendientes = snap.docs.filter((docSnap) => docSnap.data().orden === undefined);

  if (pendientes.length === 0) {
    console.log("Todos los avisos ya tienen orden asignado. Nada que hacer.");
    return;
  }

  console.log(`Asignando orden a ${pendientes.length} de ${snap.size} avisos...`);

  const batch = db.batch();
  pendientes.forEach((docSnap, index) => {
    batch.update(docSnap.ref, { orden: index });
    console.log(`  orden ${index} → ${docSnap.id} (${docSnap.data().titulo})`);
  });

  await batch.commit();
  console.log(`\nListo. ${pendientes.length} avisos con orden asignado.`);
}

migrar().catch((err) => {
  console.error("Error durante la migración:", err);
  process.exit(1);
});
