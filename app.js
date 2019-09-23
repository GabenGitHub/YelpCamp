const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    var campgrounds = [
        { name: 'Salmon Creek', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'},
        { name: 'Granite Hill', image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'},
        { name: 'Mountain Goat\'s Rest', image: 'https://images.pexels.com/photos/2419278/pexels-photo-2419278.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'}
    ]
    res.render('campgrounds', {camps: campgrounds});
});

app.listen(4000, () => {
    console.log("Server is listening");
});