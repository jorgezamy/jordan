import { getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "./firebaseAdmin";

export async function checkRateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): Promise<boolean> {
  const db = getFirestore(getAdminApp());
  const ref = db.doc(`rateLimits/${key}`);
  const now = Date.now();

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists
      ? (snap.data() as { count: number; windowStart: number })
      : { count: 0, windowStart: now };

    const withinWindow = now - data.windowStart < windowMs;
    const count = withinWindow ? data.count + 1 : 1;

    tx.set(
      ref,
      { count, windowStart: withinWindow ? data.windowStart : now },
      { merge: true }
    );

    return count <= max;
  });
}
