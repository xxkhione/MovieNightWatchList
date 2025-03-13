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

app.get('/profile', (request, response) =>{
    console.log("PROFILE")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('profile', model)
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

app.get('/watchlist', (request, response) =>{
    console.log("WATCHLIST")
    let loggedIn = false
    if(request.session.username){
        loggedIn = true
    }
    let model = {
        loggedIn: loggedIn
    }
    response.render('watchlist', model)
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})