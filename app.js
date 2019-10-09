const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const db = require('./config/keys').mongoURI;

const Campground = require('./models/camps');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

// Render camps from database 
app.get('/campgrounds', (req, res) => {
    Campground.find({})
    .then(allCampgrounds => {
        res.render('index', {camps: allCampgrounds});
    })
    .catch(err => {
        console.log(err);
    })
});

// Save camps to database
app.post('/campgrounds', (req, res) => {
    Campground.create(req.body)
    .then(() => {
        res.redirect('/campgrounds');
    })
    .catch(err => {
        console.log(err);
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new')
});

app.get('/campgrounds/:id', (req, res) => {
    // find the campground with the provided id
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err) {
            console.log(err);
        } else {
            res.render('show', {campground: foundCampground});
        }
    })
});

app.listen(4000, () => {
    console.log("Server is listening");
});