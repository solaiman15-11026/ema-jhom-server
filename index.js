const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//Middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4fsmx.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        await client.connect()
        const product = client.db('emaJhon').collection('product')

        //get app page onijayi---
        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = product.find(query)

            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()

            } else {
                products = await cursor.toArray()
            }

            res.send(products)
        })

        //pagetation
        app.get('/productcount', async (req, res) => {
            const count = await product.estimatedDocumentCount()
            res.send({ count })
        })

        //post
        // app.post('/productByKeys', async (req, res) => {
        //     const keys = req.body;
        //     const ids = keys.map(id => ObjectId(id));
        //     const query = { _id: { $in: ids } }
        //     const cursor = productCollection.find(query);
        //     const products = await cursor.toArray();
        //     console.log(keys);
        //     res.send(products);
        // })

    }

    finally {

    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('server is run')
})
app.listen(port, () => {
    console.log('listing', port)
})