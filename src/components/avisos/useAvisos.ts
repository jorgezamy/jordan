"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../../../firebaseConfig";
import { AVISOS_LIMITE } from "./constants";
import { Aviso } from "./types";
import { esVisible, ordenarAvisos } from "./utils";

export function useAvisos() {
  const [avisosRaw, setAvisosRaw] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);

  const avisosQuery = useMemo(
    () =>
      query(
        collection(db, "avisos"),
        orderBy("fechaCreacion", "desc"),
        limit(AVISOS_LIMITE),
      ),
    [],
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      avisosQuery,

      (snapshot) => {
        const docs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Aviso[];

        setAvisosRaw(docs);
        setLoading(false);
      },

      (error) => {
        console.error("❌ Firebase Error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [avisosQuery]);

  const avisos = useMemo(() => {
    const ahora = new Date();
    return ordenarAvisos(avisosRaw.filter((a) => esVisible(a, ahora)));
  }, [avisosRaw]);

  return { avisos, loading };
}
