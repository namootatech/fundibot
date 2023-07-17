import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { omit } from "ramda";

export default async function handler(req, res) {
  try{
    if (req.method === 'POST') {
      // Process a POST request
      const client = await clientPromise;
      const db = client.db("development");
      const institution = req.body;
      console.log("creating institution", institution)
      const newInstitution = await db.collection("institutions").insertOne(institution);
      res.json(newInstitution)
      
    }
    else {
      // Handle any other HTTP method
      res.status(405).json({message: "Method not allowed"})
    }
    
  }
  catch(e){
    console.log(e)
  }
}