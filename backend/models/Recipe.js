const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    photoReference: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    cookingTime: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    difficulty: { type: String, required: true, index: true },
    likes: { type: Number, default: 0, index: true },
    likedBy: { type: [mongoose.Schema.Types.ObjectId], set: (v) => [...new Set(v)] },
    comments:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    username: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);