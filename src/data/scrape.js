const courses = require('./courses.json');

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://d99c137:KioMtgdZQRgLsDtn@cluster0.ssyma3l.mongodb.net/?retryWrites=true&w=majority"
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}

let client
let clientPromise

client = new MongoClient(uri, {
  useUnifiedTopology: true,
},
{
  useNewUrlParser: true,
},
{
  connectTimeoutMS: 30000,
},
{
  keepAlive: 1,
})
clientPromise = client.connect()


async function addAllInstitutions(){
    try {
        console.log("adding institutions")
        const client = await clientPromise;
        console.log("promise resolved")
        const db = client.db("development");
        
        // for each course find institution in db  extract institution  name and _id, add institution _id and name to course and insert course into courses collection
        courses.forEach(async (course) => {
            const institution = await db.collection("institutions").findOne({institution: course.institution});
            course.institution = {
                _id: institution._id,
                institution: institution.institution
            }
            await db.collection("courses").insertOne(course);
        })
        
    } catch (e) {
        console.log(e)
    }
 };

addAllInstitutions();