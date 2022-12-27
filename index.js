const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config(); 

const port = process.env.PORT || 5000; 

const app = express(); 

// middleware
app.use(cors()); 
app.use(express.json()); 



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owk51dd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const usercollection = client.db('socialMedia').collection('users'); 
    }
    finally{

    }
}
run().catch(console.log); 



app.get('/', async(req, res) => {
    res.send('social media server is running')
}); 

app.listen(port, ()=> console.log(`social media running on ${port}`)); 