const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    favorites: { type: Map, of: Number, default: new Map() },
    liked: { type: Map, of: Number, default: new Map() },
    commented: { type: Map, of: Number, default: new Map() },
    recipes: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);