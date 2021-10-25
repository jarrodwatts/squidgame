import type { NextApiRequest, NextApiResponse } from "next";
// @ts-ignore No types for piston client available :(
import piston from "piston-client";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // IIFE to run code on piston server
  (async () => {
    try {
      const client = piston({ server: "https://emkc.org" });
      const result = await client.execute("python", 'print("Hello World!")');
      res.status(200).json(result);
    } catch (error) {
      res.status(400);
    }
  })();
}
