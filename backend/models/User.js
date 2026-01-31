const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    favorites: { type: [mongoose.Schema.Types.ObjectId], set: (v) => [...new Set(v)] },
    liked: { type: [mongoose.Schema.Types.ObjectId], set: (v) => [...new Set(v)] },
    commented: { type: [mongoose.Schema.Types.ObjectId], set: (v) => [...new Set(v)] }
});

module.exports = mongoose.model('User', userSchema);