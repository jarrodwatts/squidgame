import app from "./firebase/clientApp";
import {
  getAuth,
  signInWithPopup,
  GithubAuthProvider,
  UserCredential,
} from "firebase/auth";

export default async function signupUserWithGithub(): Promise<UserCredential> {
  const auth = getAuth(app);
  const provider = new GithubAuthProvider();
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    return Promise.reject(error);
  }
}
