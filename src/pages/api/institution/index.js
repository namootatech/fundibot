import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a GET request
      const client = await clientPromise;
      const db = client.db("development");
      const { id } = req.query;
      console.log("finding id", id);
      const institution = await db
        .collection("institutions")
        .findOne({ _id: new ObjectId(id) });
      res.json(institution);
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
  }
}
