const mongoose = require('mongoose');
const Campground = require('./models/camps');
const Comment = require('./models/comments');

const data = [
    {
        name: "Test camp 1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXfcHLNKn-30jXCgR-dOhrwzB8OGs05lwBh7wbQPC14OOrid4vGw",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint dicta corporis iusto incidunt reiciendis maxime at cumque aliquam consectetur. Iste expedita consequuntur, reiciendis quam quasi mollitia aut, laudantium ut, molestias porro eveniet dolorum maiores totam optio cupiditate. Dolores neque officiis odio, doloribus pariatur impedit beatae similique molestias quisquam id numquam?"
    },
    {
        name: "Test camp 2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxvDWXBRA6Caz55j7BTQSTMg1Mn7b13-KWezRXur-gPmwkTezmgQ",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint dicta corporis iusto incidunt reiciendis maxime at cumque aliquam consectetur. Iste expedita consequuntur, reiciendis quam quasi mollitia aut, laudantium ut, molestias porro eveniet dolorum maiores totam optio cupiditate. Dolores neque officiis odio, doloribus pariatur impedit beatae similique molestias quisquam id numquam?"
    },
    {
        name: "Test camp 3",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-7CsEF9-GlH-dVhJbHjt2T-7ioWiGNqikRxD4Pt39hT65eg_",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint dicta corporis iusto incidunt reiciendis maxime at cumque aliquam consectetur. Iste expedita consequuntur, reiciendis quam quasi mollitia aut, laudantium ut, molestias porro eveniet dolorum maiores totam optio cupiditate. Dolores neque officiis odio, doloribus pariatur impedit beatae similique molestias quisquam id numquam?"
    }
];

function seedDB() {
    //! Remove all campgrounds
    Comment.deleteMany({}).then(() => {
        console.log('deleted comments');
    }).catch(err => {
        console.log(err);
    });
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