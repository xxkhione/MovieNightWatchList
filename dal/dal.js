const { MongoClient } = require('mongodb')
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
            const requestedUser = await usersCollection.findOne({ username: username})
            return requestedUser
        } finally {
            await client.close()
        }
    },
}