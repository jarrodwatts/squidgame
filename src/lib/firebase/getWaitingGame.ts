import app from "./clientApp";
import {
  collection,
  getFirestore,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
} from "firebase/firestore";

export default async function getWaitingGame() {
  const db = getFirestore(app);
  const gamesRef = collection(db, "games");
  const waitingGameQuery = query(gamesRef, where("status", "==", "waiting"));
  const querySnapshot = await getDocs(waitingGameQuery);
  const gameDoc = querySnapshot.docs[0];

  const unsub = onSnapshot(waitingGameQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {});
  });
}
