import Submission from "./Submission";

export default interface Player {
  id: string;
  displayName: string;
  status: string;
  score: number;
  photoURL: string;
  submissions: Submission[];
}
