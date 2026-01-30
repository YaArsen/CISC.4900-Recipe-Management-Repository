const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    username: { type: String },
    parentId: { type: mongoose.Schema.Types.ObjectId },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId },
    timestamp: { type: Date, default: Date.now }
});

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    ingredients: { type: String, required: true },
    instructions: { type: String, required: true },
    photoReference: { type: String, required: true },
    isPublic: { type: Boolean, default: true },
    cookingTime: { type: String, required: true, index: true },
    category: { type: String, require: true, index: true },
    difficulty: { type: String, require: true, index: true },
    likes: { type: Number, default: 0, index: true },
    comments: { type: Map, of: commentSchema },
    username: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.Model('Recipe', recipeSchema);