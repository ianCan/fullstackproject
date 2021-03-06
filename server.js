//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const APP = express();
const db = mongoose.connection;

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

// Connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open', () => { });

//___________________
//Middleware
//___________________

//use public folder for static assets
APP.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
APP.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
APP.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
APP.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});

const moviesController = require('./controllers/movies.js');
APP.use(moviesController)

APP.get('/create-session', (req, res) => {
    console.log(req.session);
    req.session.anyProperty = 'Gone With the Wind';
    res.redirect('/movies')
});

APP.get('/retrieve-session', (req, res) => {
    if (req.session.anyProperty === 'Gone With the Wind') {
        console.log('tis a Gone With the Wind')
    } else {
        console.log('tis is NOT a Gone With the Wind')
    }
    res.redirect('/movies')
});

APP.get('/update-session', (req, res) => {
    console.log(req.session);
    req.session.anyProperty = 'Gone With the Wind';
    console.log(req.session);
    res.redirect('/movies')
});

APP.get('/delete-session', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log('something is wrong')
        } else {
            console.log('all is well')
        };
    });
    res.redirect('/movies')
});

//___________________
// Routes
//___________________
//localhost:3000
APP.get('/', (req, res) => {
    res.redirect('/movies');
});

//___________________
//Listener
//___________________
APP.listen(PORT, () => {
    console.log('Right by your side till ' + PORT + ' + 5')
});