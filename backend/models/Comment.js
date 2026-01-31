const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);