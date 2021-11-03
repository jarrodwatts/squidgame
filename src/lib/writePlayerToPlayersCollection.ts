import app from "./firebase/clientApp";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { User } from "firebase/auth";

export default async function writePlayerToPlayersCollection(
  userInfo: User
): Promise<any> {
  const db = getFirestore(app);

  console.log(userInfo);
  const { email, displayName, photoURL, uid } = userInfo;

  await setDoc(doc(db, "players", uid), {
    email,
    displayName,
    photoURL,
    uid,
  });
}
