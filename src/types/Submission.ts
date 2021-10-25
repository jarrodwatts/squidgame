import SubmissionStatus from "./SubmissionStatus";

export default interface Submission {
  id: string;
  gameId: string;
  questionId: string;
  content: string;
  status: SubmissionStatus;
}
