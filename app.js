const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 7
const { DAL } = require('./dal/dal.js')

const app = express()
const port = 3000

let sessionOptions = {
    secret: 'AkitaRose',
    cookie: {}
}

app.set('view engine', 'ejs')
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