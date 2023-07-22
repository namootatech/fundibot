import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      const data = req.body;
      await db.collection("institutions").insertOne(data);
      res.json({ message: "Institution added successfully" });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
  }
}
