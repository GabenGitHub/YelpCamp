// All the middleware goes here
const Campground = require('../models/camps');
const Comment = require('../models/comments');

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You have to be logged in to do that!');
        return res.redirect('back');
    }

    Campground.findById(req.params.id)
        .then(foundCampground => {
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', `You don't have permission to do that!`);
                res.redirect('back');
            }
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Something went wrong!');
            res.redirect('back');
        });
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You have to be logged in to do that!');
        return res.redirect('back');
    }

    Comment.findById(req.params.comment_id)
        .then(foundComment => {
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash('error', `You don't have permission to do that!`);
                res.redirect('back');
            }
        })
        .catch(err => {
            req.flash('error', 'Something went wrong!');
            res.redirect('back');
            console.log(err);
        });
};

middlewareObj.loginRequire = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You need to be logged in to do that!');
        return res.redirect('/login');
    }

    next();
};

module.exports = middlewareObj;