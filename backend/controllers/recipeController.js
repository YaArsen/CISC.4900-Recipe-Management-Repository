const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.postRecipe = async (req, res) => {
    const { name, userId } = req.user;
    const { title, cookingTime, ingredients, instructions, photoReference, isPublic, category, difficuly } = req.body;

    try {
        const recipe = new Recipe({
            title: title,
            cookingTime: cookingTime,
            ingredients: ingredients,
            instructions: instructions,
            photoReference: photoReference,
            isPublic: isPublic,
            category: category,
            difficuly: difficuly,
            likes: 0,
            likedBy: [],
            comments: [],
            username: name,
            user: userId,
            timestamp: new Date()
        });

        await recipe.save();
        res.status(201).json({ recipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    const { title, cookingTime, ingredients, instructions, isPublic, category, difficuly } = req.body;
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        recipe.title = title || recipe.title;
        recipe.cookingTime = cookingTime || recipe.cookingTime;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.instructions = instructions || recipe.instructions;
        recipe.isPublic = isPublic;
        recipe.category = category;
        recipe.difficulty = difficuly;

        await recipe.save();
        res.status(200).json({ recipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
        await Recipe.findByIdAndDelete({ _id: recipeId });
        const recipes = await Recipe.find();
        res.status(200).json({ recipes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (!recipe.likedBy.id(userId)) {
            recipe.likes++;
            recipe.likedBy.push(userId);
        } else {
            recipe.likes--;
            recipe.likedBy.pull(userId);
        }

        await recipe.save();
        res.status(200).json({ recipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.postComment = async (req, res) => {
    const { name, userId } = req.user;
    const { parentId, content } = req.body;
    const { recipeId } = req.params;

    const comment = {
        username: name,
        parentId: parentId,
        content: content,
        user: userId,
        timestamp: new Date()
    };

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        recipe.comments.push(comment);
        await recipe.save();

        const user = User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.commented.push(recipeId);
        await user.save();
        res.status(201).json({ recipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { content } = req.body;
    const { recipeId, commentId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const comment = recipe.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.content = content;
        recipe.save();
        res.status(200).json({ recipe });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const equals = (obj1, obj2) => {
    if (obj1 === null && obj2 === null) {
        return true;
    } else if (obj1 === null || obj2 === null) {
        return false;
    } else {
        return obj1.toString() === obj2.toString();
    }
};

exports.deleteComment = async (req, res) => {
    const { userId } = req.user;
    const { recipeId, commentId } = req.params;
    const topLevelComment = commentId;
    const stack = [];
    const array = [topLevelComment];

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        while (topLevelComment !== null) {
            for (let i = 0; i < recipe.comments.length; i++) {
                if (equals(topLevelComment, recipe.comments[i].parentId)) {
                    stack.push(recipe.comments[i]._id);
                    array.push(recipe.comments[i]._id);
                }
            }

            if (stack.length !== 0) {
                topLevelComment = stack.pop();
            } else {
                topLevelComment = null;
            }
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < recipe.comments.length; j++) {
                if (recipe.comments[i]._id.toString() === array[i].toString()) {
                    recipe.comments[i].remove();
                    break;
                }
            }
        }

        const user = User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (recipe.comments.filter(comment => (comment.user.toString() === user._id.toString()).length > 1)) {
            user.commented.id(recipeId).remove();
            await user.save();
        }
        res.status(200).json(recipe.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchRecipes = async (req, res) => {
    const { title, cookingTime, category, difficuly, likes } = req.query;
    const query = { isPublic: true };

    if (title.trim() !== '') query.title = { $regex: title.trim(), $options: 'i'};
    if (!isNaN(cookingTime) && cookingTime >= 0) query.cookingTime = { $lte: cookingTime };
    if (category) query.category = category;
    if (difficuly) query.difficuly = difficuly;
    if (!isNaN(likes) && likes >= 0) query.likes = { $gte: likes };

    const hasFilters = title.trim() || !isNaN(cookingTime) && cookingTime >= 0 || category || difficuly || !isNaN(likes) && likes >= 0;
    if (!hasFilters) return res.status(400).json({ message: 'Enter some text or apply at least one filter' });

    try {
        const recipes = await Recipe.find(query);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};