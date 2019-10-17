const mongoose = require('mongoose');
const Campground = require('./models/camps');
const Comment = require('./models/comments');

const data = [
    {
        name: "Test camp 1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXfcHLNKn-30jXCgR-dOhrwzB8OGs05lwBh7wbQPC14OOrid4vGw",
        description: "This is a description of the campground 1"
    },
    {
        name: "Test camp 2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxvDWXBRA6Caz55j7BTQSTMg1Mn7b13-KWezRXur-gPmwkTezmgQ",
        description: "This is a description of the campground 2"
    },
    {
        name: "Test camp 3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-7CsEF9-GlH-dVhJbHjt2T-7ioWiGNqikRxD4Pt39hT65eg_",
        description: "This is a description of the campground 3"
    }
];

function seedDB() {
    //! Remove all campgrounds
    Campground.deleteMany({}).then(() => {
        console.log('Database removed');
        //TODO: Add a few campgrounds
        data.forEach(el => {
            Campground.create(el)
            .then(campground => {
                console.log("Data added");
                //TODO: Add a few comments
                Comment.create(
                    {
                        text: "This place is great, but I wish there was internet",
                        author: "Homer"
                    }
                )
                .then(comment => {
                    campground.comments.push(comment)
                    campground.save();
                    console.log("comment added");
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
            });
        });
    }).catch(err => {
        console.log(err);
    });

};

module.exports = seedDB;