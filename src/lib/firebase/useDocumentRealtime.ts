import { useState, useEffect } from "react";
import app from "./clientApp";
import {
  doc,
  onSnapshot,
  getFirestore,
  DocumentData,
} from "firebase/firestore";

export default function useDocumentRealtime(collection: string, docId: string) {
  const [data, setData] = useState<DocumentData>();
  const db = getFirestore(app);

  const unsub = onSnapshot(doc(db, collection, docId), (doc) => {
    setData(data);
  });

  return { data };
}
