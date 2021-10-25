import { useState, useEffect } from "react";
import app from "./clientApp";
import { getAuth, User, onAuthStateChanged } from "firebase/auth";

export default function useUserAuth() {
  const auth = getAuth(app);
  const [loading, setLoading] = useState<boolean>(true);
  const [firebaseUser, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => {
    // https://firebase.google.com/docs/reference/js/firebase.User
    setLoading(false);
    setUser(user);
  });

  return [loading, firebaseUser];
}
