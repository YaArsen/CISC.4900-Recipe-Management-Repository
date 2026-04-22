const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.postRecipe = async (req, res) => {
    const { userId, name } = req.user; // From the decoded JWT
    const {
        title,
        ingredients,
        instructions,
        file,
        isPublic,
        cookingTime,
        category,
        difficulty
    } = req.body;

    try {
        const recipe = new Recipe({
            title: title,
            ingredients: ingredients,
            instructions: instructions,
            base64File: file,
            isPublic: isPublic,
            cookingTime: Number(cookingTime),
            category: category,
            difficulty: difficulty,
            username: name,
            user: userId
        });

        await recipe.save();

        const user = await User.findById({ _id: userId });
        user.recipes++;
        await user.save();

        res.status(201).json({ message: `Recipe '${recipe.title}' added successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUserRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        const startIndex = (page - 1) * limit;
        const recipes = await Recipe.find({ user: userId }).skip(startIndex).limit(parseInt(limit));
        res.status(200).json({ recipes, totalPages: Math.ceil(user.recipes / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipe = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        const user = await User.findById({ _id: userId });
        const isFavoriteButtonActivated = user.favorites.includes(recipeId);
        const isLikeButtonActivated = user.liked.includes(recipeId);
        res.status(200).json({ recipe, isFavoriteButtonActivated, isLikeButtonActivated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    const {
        title,
        ingredients,
        instructions,
        file,
        isPublic,
        cookingTime,
        category,
        difficulty
    } = req.body;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });

        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        recipe.base64File = file || recipe.base64File;
        recipe.isPublic = isPublic;
        recipe.cookingTime = Number(cookingTime);
        recipe.category = category;
        recipe.difficulty = difficulty;
        recipe.timestamp = new Date();

        await recipe.save();

        res.status(200).json({ message: `Recipe '${recipe.title}' updated successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    const { userId } = req.user;
    const { recipeId, page, limit } = req.params;

    try {
        const recipe = await Recipe.findByIdAndDelete({ _id: recipeId });
        const user = await User.findById({ _id: userId });
        user.recipes--;
        await user.save();

        const startIndex = (page - 1) * limit;
        const recipes = await Recipe.find({ user: userId }).skip(startIndex).limit(parseInt(limit));
        res.status(200).json({ message: `Recipe '${recipe.title}' deleted successfully`, recipes, totalPages: Math.ceil(user.recipes / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleFavorite = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        const isFavorite = user.favorites.includes(recipeId);
        let isActivated = false;

        if (isFavorite) {
            user.favorites.pull(recipeId);
        } else {
            user.favorites.push(recipeId);
            isActivated = true;
        }

        await user.save();
        res.status(200).json(isActivated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        const recipe = await Recipe.findById({ _id: recipeId });
        const isLiked = user.liked.includes(recipeId);
        let isActivated = false;

        if (isLiked) {
            recipe.likes -= 1;
            user.liked.pull(recipeId);
        } else {
            recipe.likes += 1;
            user.liked.push(recipeId);
            isActivated = true;
        }

        await recipe.save();
        await user.save();
        res.status(200).json({ recipe, isActivated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.postComment = async (req, res) => {
    const { userId, name } = req.user;
    const { content, parentId } = req.body;
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });

        recipe.comments.push({
            username: name,
            parentId: parentId,
            content: content,
            user: userId
        });

        await recipe.save();

        const user = await User.findById({ _id: userId });

        if (!user.commented.has(recipeId)) {
            user.commented.set(recipeId, 0);
        }

        user.commented.set(recipeId, user.commented.get(recipeId) + 1);
        await user.save();

        res.status(201).json(recipe.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { recipeId, commentId } = req.params;
    const { content } = req.body;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        const comment = recipe.comments.id(commentId);

        comment.content = content;
        comment.timestamp = new Date();
        await recipe.save();
        res.status(200).json(recipe.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { userId } = req.user;
    const { recipeId, commentId } = req.params;
    let topLevelCommentId = commentId; // topLevelCommentId is an ID of the comment the user wants to delete
    const stack1 = []; // Used to track sub comments that need to be checked
    const stack2 = [topLevelCommentId]; // Stores IDs of comments to be deleted

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        // Find all sub comments of the comment
        while (topLevelCommentId !== null) {
            for (let i = 0; i < recipe.comments.length; i++) {
                const parentId = recipe.comments[i].parentId;
                // Check if current comment in loop is a sub comment of the current comment
                if (!parentId ? false : topLevelCommentId.toString() === parentId.toString()) {
                    stack1.push(recipe.comments[i]._id);
                    stack2.push(recipe.comments[i]._id);
                }
            }
            // Move to the next nested comment, or break while loop
            if (stack1.length !== 0) {
                topLevelCommentId = stack1.pop();
            } else {
                topLevelCommentId = null;
            }
        }
        // Count how many comments in the deletion list belong to the user to update user stats
        const count = recipe.comments.filter(comment => comment.user.toString() === userId.toString() && stack2.includes(comment._id)).length;
        // Update the user's total comment count for this recipe
        const user = await User.findById({ _id: userId });
        const userNumberOfComments = user.commented.get(recipeId);
        user.commented.set(recipeId, userNumberOfComments - count);
        if (user.commented.get(recipeId) === 0) user.commented.delete(recipeId); // Remove the recipe from the user's map if they have 0 comments left
        await user.save();

        while (stack2.length !== 0) recipe.comments.pull(stack2.pop()); // Pull all gathered comments by their IDs from the recipe document
        await recipe.save();
        res.status(200).json(recipe.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchRecipes = async (req, res) => {
    const { page, limit } = req.params;
    const { title, cookingTime, difficulty, category, likes, startDate, endDate } = req.body;
    const query = { isPublic: true };

    if (title && title.trim()) query.title = { $regex: title.trim(), $options: 'i' };
    if (cookingTime) query.cookingTime = { $lte: Number(cookingTime) };
    if (likes) query.likes = { $gte: Number(likes) };
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    // Date range filter
    if (startDate || endDate) {
        query.timestamp = {};

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            query.timestamp.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            query.timestamp.$lte = end;
        }
    }

    const isThereMoreThanOne = Object.keys(query).length > 1;
    if (!isThereMoreThanOne) return res.status(400).json({ message: 'Enter some text or apply at least one filter' });

    try {
        const startIndex = (page - 1) * limit;
        const recipes = mergeSort(await Recipe.find(query).skip(startIndex).limit(parseInt(limit)));
        const total = await Recipe.countDocuments(query);
        res.status(200).json({ recipes, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (new Date(left[i].timestamp) > new Date(right[j].timestamp)) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return result.concat(left.slice(i), right.slice(j));
}

exports.getFavoriteRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        const startIndex = (page - 1) * limit;
        const recipesIds = user.favorites.slice(startIndex, startIndex + limit);
        const recipes = [];
        let removedRecipesIds = 0;

        for (let i = 0; i < recipesIds.length; i++) {
            const recipe = await Recipe.findById({ _id: recipesIds[i] });

            if (!recipe) {
                removedRecipesIds++;
                user.favorites.pull(recipesIds[i]);
                await user.save();
            } else {
                recipes.push(recipe);
            }
        }

        res.status(200).json({ recipes, totalPages: Math.ceil((user.favorites.length - removedRecipesIds) / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLikedRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        const startIndex = (page - 1) * limit;
        const recipesIds = user.liked.slice(startIndex, startIndex + limit);
        const recipes = [];
        let removedRecipesIds = 0;

        for (let i = 0; i < recipesIds.length; i++) {
            const recipe = await Recipe.findById({ _id: recipesIds[i] });

            if (!recipe) {
                removedRecipesIds++;
                user.liked.pull(recipesIds[i]);
                await user.save();
            } else {
                recipes.push(recipe);
            }
        }

        res.status(200).json({ recipes, totalPages: Math.ceil((user.liked.length - removedRecipesIds) / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};