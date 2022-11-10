const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
require('dotenv').config();

const app=express();
const port=process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bkdzfxe.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const serviceCollection = client.db('redArt').collection('services');
        const reviewCollection = client.db('redArt').collection('reviews');

        // services api 
        app.get('/services', async (req, res) => {
            const size = parseInt(req.query.size);
            console.log(size);
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(size).toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
    }
    finally{

    }
}
run().catch(console.dir)


app.get('/',(req,res)=>{
    res.send('Cake boutique server is running');
})

app.listen(port,()=>{
    console.log(`cake boutique is running on port ${port}`)
})