import clientPromise from "@/lib/mongo";
import { omit } from "ramda";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db(process.env.NEXT_PUBLIC_SELECTED_DB);
      const data = req.body;
      const response = await db.collection("institutions").updateOne(
        { _id: new ObjectId(data._id) },
        {
          $set: omit(["_id"], data),
        }
      );
      res.status(200).json({ message: "Institution updated" });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
  }
}
