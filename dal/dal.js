const { MongoClient, ObjectId } = require('mongodb')
const uri = "mongodb+srv://dev:dev@cluster.xrzowho.mongodb.net/?retryWrites=true&w=majority&appName=Cluster"
const client = new MongoClient(uri)
const myDB = client.db("CSC130")
const usersCollection = myDB.collection("users")

exports.DAL = {
    connectToClient: async function() {
        await client.connect()
    },
    closeConnection: async function() {
        await client.close()
    },
    register: async function(data) {
        console.log(data)
        const insertUserData = await usersCollection.insertOne(data)
    },
    getUserByUsername: async function(username) {
        const requestedUser = await usersCollection.findOne({username: username})
        return requestedUser
    },
    addMovie: async function(username, movie) {
        console.log(username, movie)
        const result = await usersCollection.updateOne(
            {username: username},
            {$push: {moviesAndShows: movie}}
        )
        return result
    },
    getUserWatchList: async function(username) {
        const result = await usersCollection.findOne({username: username})
        if(result) {
            return result.moviesAndShows
        } else { 
            return null;
        }
    }
}