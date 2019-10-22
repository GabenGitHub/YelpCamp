const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const seedDB = require('./seeds');
const bcrypt = require('bcryptjs');
const sessions = require('client-sessions');
const app = express();

const sessionPassword = require('./config/keys').psw;
const database = require('./config/keys').mongoURI;

mongoose.set('useCreateIndex', true);

seedDB();
const Campground = require('./models/camps');
const Comment = require('./models/comments');
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

function loginRequire(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    next();
};

// Routes

app.get('/', (req, res) => {
    res.render('landing');
});

// Render camps from database 
app.get('/campgrounds', (req, res) => {
    Campground.find({})
    .then(allCampgrounds => {
        res.render('./campgrounds/index', { camps: allCampgrounds });
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
    res.render('campgrounds/new')
});

app.get('/campgrounds/:id', (req, res) => {
    // find the campground with the provided id
    Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCampground) => {
        res.render('campgrounds/show', { campground: foundCampground });
    }).catch(err => {
        console.log(err);
    })
});

// Comment routes

app.get('/campgrounds/:id/comments/new', loginRequire, (req, res) => {
    Campground.findById(req.params.id)
    .then(foundCampground => {
        res.render('comments/new', { campground: foundCampground });
    }).catch(err => {
        console.log(err);
    });
});

app.post('/campgrounds/:id/comments', loginRequire, (req, res) => {
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

// Auth routes

app.get('/register', (req, res) => {
    res.render('register', { error: "" });
});

app.post('/register', (req, res) => {
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

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    User.findOne({ email: req.body.email}, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.render('login', { error: 'Incorrect email/password' });
        }

        req.session.userId = user._id;
        res.redirect('/campgrounds');
    });
});

app.get('/logout', (req, res) => {
    req.session.reset();
    res.redirect('/');
});

app.listen(4000, () => {
    console.log("Server is listening");
});