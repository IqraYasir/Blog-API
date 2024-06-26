const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User',  required: true},
    text: { type: String, maxLength: 100, required: true },
    date_posted: { type: Date,  required: true }
});

module.exports = mongoose.model('Comment', CommentSchema);