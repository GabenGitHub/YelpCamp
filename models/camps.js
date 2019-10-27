const mongoose = require('mongoose');
const Comment = require('./comments');

const campgroundSchema = new mongoose.Schema({
    name:           { type: String, required: true },
    image:          { type: String, required: true },
    description:    { type: String, required: true },
    date:           { type: Date, default: Date.now },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        id:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        firstName:  { type: String, require: true },
        lastName:   { type: String, require: true }
    }
});

campgroundSchema.pre('remove', async function () {
    await Comment.deleteMany({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = mongoose.model('Campground', campgroundSchema);