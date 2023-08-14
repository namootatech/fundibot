import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db(process.env.NEXT_PUBLIC_SELECTED_DB);
      const { name, page } = req.query;
      console.log("** Searching for institution:", name, " page ", page);
      const limit = 10;
      const skip = (page - 1) * limit;
      const institutions = await db
        .collection("institutions")
        .find({ name: { $regex: name, $options: "i" } })
        .skip(skip)
        .limit(limit)
        .toArray();
      const total = await db
        .collection("institutions")
        .find({ name: { $regex: name, $options: "i" } })
        .count();
      console.log("Found ", institutions.length, " institutions");
      res.json({ institutions, total });
    } else {
      // Handle any other HTTP method
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (e) {
    console.log(e);
    res.status(405).json({ message: "Something went wrong", error: e });
  }
}
