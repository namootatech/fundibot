import clientPromise from "@/lib/mongo";
import logger from "@/lib/logger";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      logger.info(req.query);
      logger.info(req.query.page);
      const page = parseInt(req.query.page, 10);
      const creator = req.query.creator;
      logger.info(
        `** Fetching institutions page created by:${creator} ,page: ${page}`
      );
      const limit = 10;
      const skip = page * limit;
      const institutions = await db
        .collection("institutions")
        .find({ "createdBy.id": { $eq: creator } })
        .skip(skip)
        .limit(limit)
        .toArray();

      const programmes = await db
        .collection("programmes")
        .find({ "createdBy.id": { $eq: creator } })
        .skip(skip)
        .limit(limit)
        .toArray();

      const total = institutions.length;
      logger.info(`** Found , ${total},  institutions`);
      logger.info(`** Found , ${programmes.length},  programmes`);
      res.json({ institutions, programmes });
    } else {
      logger.info("** Method not allowed ", req.method);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    logger.error(e);
    res.status(405).json({ message: "Something went wrong", error: e });
  }
}
