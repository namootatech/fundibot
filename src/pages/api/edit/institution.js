import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { omit } from "ramda";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db(process.env.NEXT_PUBLIC_SELECTED_DB);
      const { id } = req.query;
      const institution = req.body;
      console.log("updating id", id);
      const updatedInstitution = await db
        .collection("institutions")
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: omit(["_id"], institution) }
        );
      res.json(updatedInstitution);
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
  }
}
