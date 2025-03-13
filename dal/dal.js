const { MongoClient, ObjectId } = require('mongodb')
const uri = "mongodb+srv://dev:dev@cluster.xrzowho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
const client = new MongoClient(uri)
const myDB = client.db("CSC130")
const usersCollection = myDB.collection("users")

exports.DAL = {
    register: async function(data) {
        try{
            await client.connect()
            console.log(data)
            const insertUserData = await usersCollection.insertOne(data)
        } finally {
            await client.close()
        }
    },
    getUserByUsername: async function(username) {
        try {
            await client.connect()
            const requestedUser = await usersCollection.findOne({username: username})
            return requestedUser
        } finally {
            await client.close()
        }
    },
    addMovie: async function(username, movie) {
        try{
            await client.connect()
            const result = await usersCollection.updateOne(
                {username : username},
                {$push: {movies: movie}}
            )
            return result
        } finally {
            await client.close()
        }
    },
    getUserWatchList: async function(userId) {
        try {
            await client.connect();
            const result = await usersCollection.findOne(
                {_id: new ObjectId(userId)},
                {projection: {movies: 1}}
            )
            return user ? user.movies : null;
        } finally {
            await client.close()
        }
    }
}