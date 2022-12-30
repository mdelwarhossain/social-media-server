const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.owk51dd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}


async function run() {
    try {
        const usersCollection = client.db('socialMedia').collection('users');
        const postsCollection = client.db('socialMedia').collection('posts');
        const commentsCollection = client.db('socialMedia').collection('comments');

        // get user
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = {
                email: email,
            };
            const user = await usersCollection.findOne(query);
            res.send(user);
        });

        // update an user

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const profile = req.body;
            const filter = { email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    address: profile.address,
                    birthday: profile.birthday,
                    sex: profile.sex,
                    image: profile.image,
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

         // update an googleuser

         app.put('/googleusers/:email', async (req, res) => {
            const email = req.params.email;
            const profile = req.body;
            const filter = { email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: profile.name,
                    email: profile.email,
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // get all post
        app.get('/posts', async (req, res) => {
            const query = {};
            const posts = await postsCollection.find(query).toArray();
            res.send(posts);
        });

        // get specific post
        app.get('/posts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = await postsCollection.findOne(query);
            res.send(post);
        });

        // get popular post
        app.get('/popularposts', async (req, res) => {
            const query = {}; 
            const sort = { like: -1 }; 
            const limit = 3; 
            const popularposts = await postsCollection.find(query).sort(sort).limit(limit).toArray(); 
            res.send(popularposts);
        });

        // save post
        app.post('/post', async (req, res) => {
            const post = req.body;
            const result = await postsCollection.insertOne(post);
            res.send(result);
        });

         // add comments

         app.put('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const comment = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $push: {
                    comments: {comment},
                }
            }
            const result = await postsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // save comments
        app.post('/comments', async (req, res) => {
            const comment = req.body;
            const result = await commentsCollection.insertOne(comment);
            res.send(result);
        });

        // save likes
        app.put('/like/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const count = req.body;
            console.log(count);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    like: count.like,
                }
            }
            console.log(updatedDoc);
            const result = await postsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });

        // get specific comment
        app.get('/comments/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                id: id,
            }
            const comments = await commentsCollection.find(query).toArray();
            res.send(comments);
        });

        // signup
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('social media server is running')
});

app.listen(port, () => console.log(`social media running on ${port}`)); 