const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedDB = require('./seeds');
const sessions = require('client-sessions');
const app = express();

// Importing routes
const indexRoutes = require('./routes/index').router;
const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');

// Keys
const sessionPassword = require('./config/keys').psw;
const database = require('./config/keys').mongoURI;

// Database
mongoose.set('useCreateIndex', true);
// seedDB();
const User = require('./models/users');

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(sessions({
    cookieName: 'session',
    secret: sessionPassword,
    duration: 10 * 60 * 1000,       // 10 mins session
    activeDuration: 10 * 60 * 1000, // Prolong 10 mins
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.user;

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

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(4000, () => {
    console.log("Server is listening");
});