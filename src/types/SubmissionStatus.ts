export default interface SubmissionStatus {
  status: "waiting" | "running" | "failed" | "succeeded";
}
