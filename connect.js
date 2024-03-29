const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const client = new MongoClient(process.env.MONGO_URL);

async function launch_dtb() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to DataBase !");
}

launch_dtb().catch(console.dir);
