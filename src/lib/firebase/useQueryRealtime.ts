import app from "./clientApp";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  WhereFilterOp,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useState } from "react";

export default function useQueryRealtime(
  collectionName: string,
  fieldName: string,
  opStr: WhereFilterOp,
  fieldValue: string
) {
  const db = getFirestore(app);
  const gamesRef = collection(db, collectionName);
  const waitingGameQuery = query(gamesRef, where(fieldName, opStr, fieldValue));

  const unsub = onSnapshot(waitingGameQuery, (snap) => {
    console.log(snap.docs[0]);
    return snap.docs[0];
  });
}
