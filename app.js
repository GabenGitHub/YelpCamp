const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const sessions = require('client-sessions');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

// Importing routes
const indexRoutes = require('./routes/index').router;
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

// Keys
const DB_CONNECTION = process.env.DB_CONNECTION;
const SESSION_PSW = process.env.SESSION_PSW;

// Database
const User = require('./models/users');

mongoose.connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Configs
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// Session
app.use(sessions({
    cookieName: 'session',
    secret: SESSION_PSW,
    duration: 10 * 60 * 1000,       // 10 mins session
    activeDuration: 10 * 60 * 1000, // Prolong 10 mins
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');

    if (!(req.session && req.session.userId)) {
        return next();
    }

    User.findById(req.session.userId, (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return next();
        }
        
        user.password = undefined;
            
        req.user = user;
        res.locals.user = user;
        next();
    });
});

// Routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(4000, () => {
    console.log("Server is listening");
});