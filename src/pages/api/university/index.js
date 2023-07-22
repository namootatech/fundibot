import clientPromise from "@/lib/mongo";
import logger from "@/lib/logger";
import { ObjectId } from "mongodb";
import { assoc } from "ramda";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      const id = req.query.id;
      logger.info(`** Fetching university:, ${id}`);
      const institution = await db.collection("institutions").findOne({_id: new ObjectId(id)});
      logger.info(`** Found , ${institution.institution}`);
      res.json(assoc("name", institution.institution, institution));
    } else {
      logger.info("** Method not allowed ", req.method);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e)
    logger.error(e)
    res.status(405).json({message: "Something went wrong", error: e})
  }
}
