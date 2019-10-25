const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text:   { type: String, required: true },
    date:   { type: Date, default: Date.now },
    author: { 
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        firstName:  { type: String, require: true },
        lastName:   { type: String, require: true }
            }
});

module.exports = mongoose.model('Comment', commentSchema);