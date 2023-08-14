import clientPromise from "@/lib/mongo";
import logger from "@/lib/logger";
import { ObjectId } from "mongodb";
import { assoc } from "ramda";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db(process.env.NEXT_PUBLIC_SELECTED_DB);
      const id = req.query.uni;
      logger.info(`** Fetching university:, ${id}`);
      const institution = await db
        .collection("institutions")
        .findOne({ _id: new ObjectId(id) });
      logger.info(`** Found , ${institution.institution}`);
      logger.info(`** Fetching faculty:, ${req.query.id}`);
      const faculty = institution.faculties.find((faculty) => {
        return faculty.id.toString() === req.query.id;
      });
      logger.info(`** Found , ${faculty.name}`);
      //find programmes for faculty in db
      const programmes = await db
        .collection("programmes")
        .find({ faculty: faculty.id.toString() })
        .toArray();
      logger.info(`** Found , ${programmes.length} programmes`);
      res.json({ institution, faculty, programmes });
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
