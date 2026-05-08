const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    favorites: [mongoose.Schema.Types.ObjectId],
    liked: [mongoose.Schema.Types.ObjectId],
    commented: [mongoose.Schema.Types.ObjectId],
    recipes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);