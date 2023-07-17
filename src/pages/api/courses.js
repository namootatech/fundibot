import clientPromise from "@/lib/mongo";

export default async function handler(req, res) {
  try{
    if (req.method === 'GET') {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      const courses = await db.collection("courses").find({}).toArray();
      res.json(courses);
  
    } else {
      // Handle any other HTTP method
      res.status(405).json({message: "Method not allowed"})
    }
  }
  catch(e){
    console.log(e)
  }
}