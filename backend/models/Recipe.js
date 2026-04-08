const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: String,
    parentId: mongoose.Schema.Types.ObjectId,
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [{ type: String }],
    instructions: { type: String, required: true },
    base64File: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    cookingTime: { type: Number, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
    username: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);