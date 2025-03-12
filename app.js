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
app.use(express.static(__dirname + '/public'));
app.use(express.static("public"))
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})