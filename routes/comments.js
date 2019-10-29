const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/camps');
const Comment = require('../models/comments');
const middleware = require('../middleware');

// Comment routes

router.get('/new', middleware.loginRequire, (req, res) => {
    Campground.findById(req.params.id)
        .then(foundCampground => {
            res.render('comments/new', { campground: foundCampground });
        }).catch(err => {
            console.log(err);
        });
});

router.post('/', middleware.loginRequire, (req, res) => {
    Campground.findById(req.params.id)
        .then((campground) => {
            Comment.create(req.body)
                .then(comment => {
                    // Add first name and id to comment
                    comment.author.firstName = req.user.firstName;
                    comment.author.lastName = req.user.lastName;
                    comment.author.id = req.user._id;
                    // Save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${req.params.id}`);
                }).catch(err => {
                    console.log(err);
                });
        }).catch(err => {
            console.log(err);
        });
});

// Edit comments routes
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id)
        .then(foundComment => {
                res.render('comments/edit', { comment: foundComment, campground_id: req.params.id });
        })
        .catch(err => {
            console.log(err);
        });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body)
        .then(() => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            console.log(err);
        });
});

// Destroy comments route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id)
        .then(() => {
            res.redirect(`/campgrounds/${req.params.id}`);
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;