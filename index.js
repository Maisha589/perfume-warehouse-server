const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brcug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("Perfume").collection("product");

        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })

    }
    finally {

    }
}

run().catch(console.dir);



// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("running royal perfume server")
});

app.listen(port, () => {
    console.log("Listening to port", port)
})