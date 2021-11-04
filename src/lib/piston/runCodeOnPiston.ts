// @ts-ignore No types for piston client available :(
import piston from "piston-client";
import { doc, getFirestore, addDoc, collection } from "firebase/firestore";
import app from "../firebase/clientApp";
import { User } from "@firebase/auth";

export default async function runCodeOnPiston(
  language: string,
  code: string,
  args: any[],
  acceptedAnswers: string[],
  user: User,
  qustionId: string,
  gameId: string
) {
  const db = getFirestore(app);
  try {
    const client = piston({ server: "https://emkc.org" });

    const result = await client.execute(language, code, {
      args: [...args],
    });

    const output = result.run.output;
    // Trim output to exclude new lines and \n
    const outputString = output.trim();

    // Write submission to firestore submissions collection
    await addDoc(collection(db, "submissions"), {
      userId: user.uid,
      questionId: qustionId,
      gameId: gameId,
      language: language,
      code: code.toString(),
      acceptedAnswers: acceptedAnswers,
      output: outputString,
      correct: acceptedAnswers.includes(outputString),
    });

    if (acceptedAnswers.includes(outputString)) {
      return {
        success: true,
        message: "Correct!",
      };
    } else {
      return {
        success: false,
        message: "Incorrect!",
        expected: acceptedAnswers.join(", "),
        provided: outputString,
      };
    }
  } catch (error) {
    console.error("Error occurred running code on client", error);
  }
}
