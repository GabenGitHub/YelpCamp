// All the middleware goes here
const Campground = require('../models/camps');
const Comment = require('../models/comments');

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (!req.user) {
        return res.redirect('back');
    }

    Campground.findById(req.params.id)
        .then(foundCampground => {
            if (foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        })
        .catch(err => {
            res.redirect('back');
            console.log(err);
        });
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (!req.user) {
        return res.redirect('back');
    }

    Comment.findById(req.params.comment_id)
        .then(foundComment => {
            if (foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        })
        .catch(err => {
            res.redirect('back');
            console.log(err);
        });
};

middlewareObj.loginRequire = function(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    next();
};

module.exports = middlewareObj;