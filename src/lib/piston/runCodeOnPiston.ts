// @ts-ignore No types for piston client available :(
import piston from "piston-client";

export default async function runCodeOnPiston(language: string, code: string) {
  try {
    const client = piston({ server: "https://emkc.org" });
    const result = await client.execute(language, code);
    return result;
  } catch (error) {
    console.error("Error occurred running code on client", error);
  }
}
