const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brcug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productCollection = client.db("Perfume").collection("product");
        const orderCollection = client.db("Perfume").collection("order");

        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const perfume = await productCollection.findOne(query);
            res.send(perfume);
        })

        // Post
        app.post("/products", async (req, res) => {
            const newPerfume = req.body;
            const result = await productCollection.insertOne(newPerfume);
            res.send(result);
        })
        // Delete
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })

        app.put("/products/:id", async (req, res) => {
            const id = req.params.id;
            const newStock = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    stock: newStock.stock
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // Order
        app.get("/order", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
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