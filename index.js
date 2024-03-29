const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000

// middlewares 
app.use(cors());
app.use(express.json());

// code from mongodb 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0fn8ke9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

// database and connections
        const productsCollection = client.db("nightfallDB").collection("products");
        const cartCollection = client.db("nightfallDB").collection("carts");


        // products collection data
        app.get('/products', async(req, res) => {
            const result = await productsCollection.find().toArray(); 
            res.send(result); 
        })

        // send carts to the database
        app.post('/carts', async(req, res) => {
            const cartItem = req.body; 
            const result = await cartCollection.insertOne(cartItem); 
            res.send(result); 
        })

        // get carts from the database to show to the user
        app.get('/carts', async(req, res) => {
            const result = await cartCollection.find().toArray();
            res.send(result); 
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('nightfall running')
})

app.listen(port, () => {
    console.log(`nightfall is runnig from port : ${port}`);
    // console.log(process.env)
})