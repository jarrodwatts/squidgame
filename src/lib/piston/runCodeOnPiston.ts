// @ts-ignore No types for piston client available :(
import piston from "piston-client";

export default async function runCodeOnPiston(
  language: string,
  code: string,
  args: any[],
  acceptedAnswers: string[]
) {
  try {
    console.log(args);
    const client = piston({ server: "https://emkc.org" });

    const result = await client.execute(language, code, {
      args: [...args],
    });

    const output = result.run.output;
    // Trim output to exclude new lines and \n
    const outputString = output.trim();
    console.log(outputString);

    if (acceptedAnswers.includes(outputString)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error occurred running code on client", error);
  }
}
