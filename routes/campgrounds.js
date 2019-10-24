const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camps');

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
router.post('/', (req, res) => {
    Campground.create(req.body)
        .then(() => {
            res.redirect('/campgrounds');
        }).catch(err => {
            console.log(err);
        });
});

router.get('/new', (req, res) => {
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