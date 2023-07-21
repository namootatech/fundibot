import clientPromise from "@/lib/mongo";
import logger from "@/lib/logger";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      logger.info(req.query)
      logger.info(req.query.page)
      const page = parseInt(req.query.page, 10);
      logger.info(`** Fetching institutions page:, ${page}`);
      const limit = 10;
      const skip = page * limit;
      const institutions = await db
        .collection("institutions")
        .find({"type": "university"})
        .skip(skip)
        .limit(limit)
        .toArray();
      const total = await db
        .collection("institutions")
        .find({"type": "university"})
        .count();
      logger.info(`** Found , ${total},  institutions`);
      res.json({institutions, total});
    } else {
      logger.info("** Method not allowed ", req.method);
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    logger.error(e)
    res.status(405).json({message: "Something went wrong", error: e})
  }
}
