const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camps');
const loginRequire = require('./index').loginRequire;

// Campgrounds routes

router.get('/', (req, res) => {
    Campground.find({})
        .then(allCampgrounds => {
            res.render('./campgrounds/index', { camps: allCampgrounds });
        }).catch(err => {
            console.log(err);
        })
});

// Save camps to database
router.post('/', loginRequire, (req, res) => {
    let campName = req.body.name;
    let campImage = req.body.image;
    let campDesc = req.body.description;

    let authorObj = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        id: req.user._id
    };
    
    let newCampground = {
        name: campName,
        image: campImage,
        description: campDesc,
        author: authorObj
    }
    Campground.create(newCampground)
        .then((campground) => {
            campground.save();
            res.redirect('/campgrounds');
        }).catch(err => {
            console.log(err);
        });
});

router.get('/new', loginRequire, (req, res) => {
    res.render('campgrounds/new')
});

router.get('/:id', (req, res) => {
    // find the campground with the provided id
    Campground.findById(req.params.id).populate('comments').exec()
        .then((foundCampground) => {
            res.render('campgrounds/show', { campground: foundCampground });
        }).catch(err => {
            console.log(err);
        })
});

module.exports = router;