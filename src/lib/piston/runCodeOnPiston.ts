// @ts-ignore No types for piston client available :(
import piston from "piston-client";

export default async function runCodeOnPiston(
  language: string,
  code: string,
  args: any[],
  acceptedAnswers: string[]
) {
  try {
    const client = piston({ server: "https://emkc.org" });

    const result = await client.execute(language, code, {
      args: [...args],
    });

    const output = result.run.output;
    // Trim output to exclude new lines and \n
    const outputString = output.trim();

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
