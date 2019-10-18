const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedDB = require('./seeds');

const db = require('./config/keys').mongoURI;

seedDB();
const Campground = require('./models/camps');
const Comment = require('./models/comments');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Routes

app.get('/', (req, res) => {
    res.render('landing');
});

// Render camps from database 
app.get('/campgrounds', (req, res) => {
    Campground.find({})
    .then(allCampgrounds => {
        res.render('./campgrounds/index', {camps: allCampgrounds});
    }).catch(err => {
        console.log(err);
    })
});

// Save camps to database
app.post('/campgrounds', (req, res) => {
    Campground.create(req.body)
    .then(() => {
        res.redirect('/campgrounds');
    }).catch(err => {
        console.log(err);
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new')
});

app.get('/campgrounds/:id', (req, res) => {
    // find the campground with the provided id
    Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCampground) => {
        res.render('campgrounds/show', {campground: foundCampground});
    }).catch(err => {
        console.log(err);
    })
});

// Comment routes

app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id)
    .then(foundCampground => {
        res.render('comments/new', {campground: foundCampground});
    }).catch(err => {
        console.log(err);
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id)
    .then((campground) => {
        Comment.create(req.body)
        .then(comment => {
            campground.comments.push(comment);
            campground.save();
            res.redirect('/campgrounds/' + campground._id);
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
});

app.listen(4000, () => {
    console.log("Server is listening");
});