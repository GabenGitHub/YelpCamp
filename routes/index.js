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
            req.flash('success', 'You are registered successfully!')
            res.redirect('/campgrounds');
        })
        .catch(err => {
            if (err.code === 11000) {
                return res.render('register', { error: 'That e-mail is already registered!' });
            }

            req.flash('error', 'Something went wrong!');
            return res.redirect('/register');
        })
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            req.flash('error', 'Incorrect e-mail or password!');
            return res.redirect('/login');
        }
        
        req.session.userId = user._id;
        req.flash('success', `Welcome ${user.firstName}`);
        res.redirect('/campgrounds');
    });
});

router.get('/logout', (req, res) => {
    req.session.reset();
    req.flash('success', 'You logged out successfully!');
    res.redirect('/');
});

module.exports = { router };