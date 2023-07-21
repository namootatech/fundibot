import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { hash } from 'bcrypt';
const {assoc, omit } = require('ramda');

export default async function handler(req, res) {
  try{
    if (req.method === 'POST') {
      const client = await clientPromise;
      const db = await client.db("development");
      const collection = await db.collection('providers');
      const user = req.body;
      const hashedPassword = await hash(user.password, 12);
      const newUser = assoc('password', hashedPassword, user);
      await collection.insertOne(newUser);
      res.status(200).json({message: "User created successfully"})
    } 
    else {
      res.status(500).json({error: {message: "Internal server error"}})
    }
    
  }
  catch(e){
    console.log(e)
  }
}