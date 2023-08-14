import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { hash, compare } from "bcrypt";
const { assoc, omit, isNil, isEmpty } = require("ramda");

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const client = await clientPromise;
      const db = await client.db(process.env.NEXT_PUBLIC_SELECTED_DB);
      const collection = await db.collection("providers");
      const { email, password } = req.body;
      console.log("Email", email);
      console.log("Password", password);
      const dbUserWithEmail = await collection.findOne({ email: email });
      console.log("FoUnd user", dbUserWithEmail);
      if (isNil(dbUserWithEmail) || isEmpty(dbUserWithEmail)) {
        res
          .status(401)
          .json({ error: { message: "Invalid email or password" } });
      } else {
        const user = dbUserWithEmail;
        const passwordMatch = await compare(password, user.password);
        if (passwordMatch) {
          res.status(200).json(dbUserWithEmail);
        } else {
          res
            .status(401)
            .json({ error: { message: "Invalid email or password" } });
        }
      }
    } else {
      res.status(500).json({ error: { message: "Internal server error" } });
    }
  } catch (e) {
    console.log(e);
  }
}
