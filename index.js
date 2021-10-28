const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.port || 5000;
const cors = require('cors');

app.use(cors());
app.use(express.json());



// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d4sj3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("ema-jhon");
        const productscellection = database.collection("products");

        app.get('/products', async (req, res) => {
            console.log(req.query.size);
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const cursor = productscellection.find({});
            const count = await cursor.count();
            let result;
            if (page) {
                console.log(page);
                result = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                result = await cursor.toArray();
            }
            //console.log(count);
            res.send({
                count,
                result
            });
        })


        app.post('/products/bykeys', async (req, res) => {
            const keys = req.body;
            // console.log('hitted the post ', keys);
            const query = { key: { $in: keys } }
            const products = await productscellection.find(query).toArray();
            //console.log(req.body)
            res.json(products);
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('server is runing');
    res.send('server run');
})

app.listen(port, () => {
    console.log('server is running in port ', port);
})