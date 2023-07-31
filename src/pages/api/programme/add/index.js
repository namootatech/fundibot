import clientPromise from "@/lib/mongo";
import logger from "@/lib/logger";
import { ObjectId } from "mongodb";
import { assoc } from "ramda";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      const data = req.body;
      logger.info(`** Adding programme:, ${data}`);
      const programmes = await db.collection("programmes").insertOne(data);
      logger.info(`** Inserted , ${data.name}`);
      res.json({ success: true });
    } else {
      logger.info("** Method not allowed ", req.method);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
    logger.error(e);
    res.status(405).json({ message: "Something went wrong", error: e });
  }
}
