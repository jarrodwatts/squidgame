import TestCase from "./TestCase";

export default interface Question {
  id: string;
  name: string;
  content: string;
  testCases: TestCase[];
}
