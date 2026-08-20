"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";

import { db } from "../../../firebaseConfig";
import { Cita } from "./types";

export function useCitaBiblica() {
  const [cita, setCita] = useState<Cita | null>(null);
  const [loading, setLoading] = useState(true);

  const citaQuery = useMemo(
    () => query(collection(db, "citas"), orderBy("fechaCreacion", "desc"), limit(1)),
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      citaQuery,

      (snapshot) => {
        const docSnap = snapshot.docs[0];
        setCita(docSnap ? ({ id: docSnap.id, ...docSnap.data() } as Cita) : null);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [citaQuery]);

  return { cita, loading };
}
