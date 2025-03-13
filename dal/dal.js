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
    deleteMovie: async function(username, title) {
        console.log(`Deleting movie: ${title} for user: ${username}`);

        const result = await usersCollection.updateOne(
            { username: username },
            { $pull: { moviesAndShows: { title: title } } }
        );

        if (result.modifiedCount === 0) {
            throw new Error("Movie not found or not deleted");
        }

        return result;
    },
    getUserWatchList: async function(username) {
        const result = await usersCollection.findOne({username: username})
        if(result) {
            return result.moviesAndShows
        } else { 
            return null;
        }
    },
    filterWatchListByAlphabet: async function(username) {
        const result = await usersCollection.aggregate([
            {
                $match: {
                    username: username
                }
            },
            {
                $set: {
                    moviesAndShows: {
                        $sortArray: {
                            input: "$moviesAndShows",
                            sortBy: {title: 1}
                        }
                    }
                }
            }
        ])
        return result[0]
    },
    filterWatchListByGenre: async function(username) {
        const result = await usersCollection.aggregate([
            {
                $match: {
                    username: username
                }
            },
            {
                $set: {
                    moviesAndShows: {
                        $sortArray: {
                            input: "$moviesAndShows",
                            sortBy: {genre: 1}
                        }
                    }
                }
            }
        ])
        return result[0]
    },
    deleteGame: async function(username, title) {
        const result = await usersCollection.updateOne(
            { username: username },
            { $pull: {moviesAndShows: {title: title}}}
        )
        return result;
    },
}