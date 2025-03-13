const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 7
const { DAL } = require('./dal/dal.js')

const app = express()
const port = 3000

let sessionOptions = {
    secret: 'AkitaRose',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(session(sessionOptions))

app.get('/', (request, response) =>{
    console.log("HOME")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('home', model)
});

app.get('/login', (request, response) =>{
    console.log("LOGIN")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('login', model)
});

app.post('/login', async(request, response) => {
    console.log("LOGIN POSTED")
    let username = request.body.username
    let password = request.body.password
    let user = await DAL.getUserByUsername(username)
    let isCorrectPassword = await bcrypt.compare(password, user.password)
    if(username == user.username && isCorrectPassword){
        request.session.username = username
        console.log('LOGGED IN!', request.session.username)
        response.redirect(`/profile/${username}`)
    } else{
        // Probably give an error message
        response.redirect('/login')
    }
});

app.get('/profile/:username', async (request, response) => {
    let username = request.params.username
    let requestedUser = await DAL.getUserByUsername(username)
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
        if(requestedUser){
            let model = {
                name: requestedUser.name,
                username: requestedUser.username,
                numberOfMoviesAndShow: requestedUser.moviesAndShows.length,
                loggedIn: loggedIn
            }
            response.render('profile', model)
        }
    } else{
        response.redirect('/')
    }
});

app.get('/register', (request, response) =>{
    console.log("REGISTER")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('register', model)
});

app.post('/register', async (request, response) => {
    console.log("REGISTER SUCCESSFUL!")
    let password = request.body.password
    let newPassword = await bcrypt.hash(password, saltRounds)
    let newUserData = {
        username: request.body.username,
        password: newPassword,
        moviesAndShows: [],
    }
    DAL.register(newUserData)
    response.redirect('/login')
});

app.get('/watchlist/:username', async (request, response) =>{
    console.log("WATCHLIST")
    let loggedIn = false
    if(request.params.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn,
        username: request.params.username,
        moviesAndShows: await DAL.getUserWatchList(request.params.username)
    }
    console.log(model.moviesAndShows)
    response.render('watchlist', model)
});

app.post('/watchlist/add/:username', async (request, response) => {
    console.log("ADD TO WATCHLIST")
    let username = request.params.username
    let title = request.body.title
    let genre = request.body.genre
    let imageURL = request.body.imageURL
    let isShow = request.body.isShow === 'true'
    if(isShow) {
        let season = request.body.season
        let episode = request.body.episode
        let show = {
            title: title,
            imageURL: imageURL,
            genre: genre,
            season: season,
            episode: episode,
        }
        console.log(show)
        DAL.addMovie(username, show)
        response.redirect(`/watchlist/${username}`)
    } else {
        let movie = {
            title: title,
            imageURL: imageURL,
            genre: genre,
        }
        console.log(movie)
        DAL.addMovie(username, movie)
        response.redirect(`/watchlist/${username}`)
    }
});

app.get('/logout', (request, response) => {
    console.log("LOGOUT REQUEST")
    request.session.destroy()
    response.redirect('/')
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    DAL.connectToClient()
})