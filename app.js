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

app.get('/watchlist', (request, response) =>{
    console.log("WATCHLIST")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
        moviesAndShows = request.body.moviesAndShows
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('watchlist', model)
});

app.post('/watchlist/add', (request, response) => {
    console.log("ADD TO WATCHLIST")
    let title = request.body.title
    let genre = request.body.genre
    let isShow = request.body.is-show
    if(isShow) {
        let season = request.body.season
        let episode = request.body.episode
        let show = {
            title: title,
            genre: genre,
            season: season,
            episode: episode,
        }
        DAL.addMovie(show)
        response.redirect('/watchlist')
    } else {
        let movie = {
            title: title,
            genre: genre,
        }
        DAL.addMovie(movie)
        response.redirect('/watchlist')
    }
});

app.get('/logout', (request, response) => {
    console.log("LOGOUT REQUEST")
    request.session.destroy()
    response.redirect('/')
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})