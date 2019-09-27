const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

var campgrounds = [
    { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Granite Hill', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Granite Hill', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Granite Hill', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' },
    { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' }
];

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {

    res.render('campgrounds', {camps: campgrounds});
});

app.post('/campgrounds', (req, res) => {
    // ! get data from a form and add it to the array
    var name = req.body.name;
    var image = req.body.image;
    var obj = {name: name, image: image};
    campgrounds.push(obj);
    res.redirect('/campgrounds');
    // todo: redirect back to campgrounds page
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new')
});

app.listen(4000, () => {
    console.log("Server is listening");
});