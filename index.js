const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()

app.use(express.json());
app.use(cors());    


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f3vnw1n.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("BistroBoss");
    const menus = database.collection("menus");
    const reviews = database.collection("reviews");
    const cartCollection = database.collection("cartCollection");


    // get all data from database
    app.get('/menu', async(req, res) => {
        const menucollection = await menus.find().toArray();
        res.send(menucollection);
    })


    // get all review from database
    app.get('/reviews', async(req, res) => {
        const menucollection = await reviews.find().toArray();
        res.send(menucollection);
    })

    // get cart collection number for showing the cart/wishilist button
    app.get('/getallCard', async(req, res) => {
      const email = req.query.email;
      const query = {email: email}
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    })
    // post cart info 
    app.post('/addToCard', async(req, res) => {
      const cartInfo = req.body;
      const result = await cartCollection.insertOne(cartInfo);
      res.send(result);
    })

    // delete a item from user dashboard (mycart route)
    app.delete('/deleteitemfromMycart/:id', async(req, res) => {
      const item = req.params.id;
      const query = {_id: new ObjectId(item)};
      const result = await cartCollection.deleteOne(query);
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
  res.send('Bistro boss server is Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})