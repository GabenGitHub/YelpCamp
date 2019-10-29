const express = require('express');
const router = express.Router({mergeParams: true});
const bcrypt = require('bcryptjs');
const User = require('../models/users');

// Root route

router.get('/', (req, res) => {
    res.render('landing');
});

// Auth routes

router.get('/register', (req, res) => {
    res.render('register', { error: '' });
});

router.post('/register', (req, res) => {
    // Hashing password
    let hash = bcrypt.hashSync(req.body.password, 14);
    req.body.password = hash;
    let user = new User(req.body);

    // Saving user to database
    user.save()
        .then(() => {
            res.redirect('/');
        })
        .catch(err => {
            let error = 'Something bad happened!';

            if (err.code === 11000) {
                error = 'That email is already taken';
            }

            return res.render('register', { error: error });
        })
});

router.get('/login', (req, res) => {
    res.render('login', { error: '' });
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.render('login', { error: 'Incorrect email/password' });
        }

        req.session.userId = user._id;
        res.redirect('/campgrounds');
    });
});

router.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

module.exports = { router };