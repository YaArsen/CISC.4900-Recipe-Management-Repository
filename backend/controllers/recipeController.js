const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { getObjectId } = require('../utils/ObjectId');
const { mergeSort } = require('../utils/sortingAlgorithm');

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
            cookingTime: cookingTime,
            category: category,
            difficulty: difficulty,
            username: name,
            user: userId
        });

        await recipe.save();

        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
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
        if (!user) return res.status(404).json({ message: 'User not found' });
        const startIndex = (page - 1) * limit;
        const recipes = await Recipe.find({ user: userId }).skip(startIndex).limit(parseInt(limit));
        res.status(200).json({ recipes, totalPages: Math.ceil(user.recipes / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipe = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        const user = await User.findById({ _id: recipe.user });

        if (user.name !== recipe.username) {
            recipe.username = user.name;
            await recipe.save();
        }

        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.isActivated = async (req, res) => {
    const { userId } = req.user;
    const { recipeId } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const isFavoriteButtonActivated = user.favorites.has(recipeId);
        const isLikeButtonActivated = user.liked.has(recipeId);

        res.status(200).json({ isFavoriteButtonActivated, isLikeButtonActivated });
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
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;
        recipe.base64File = file || recipe.base64File;
        recipe.isPublic = isPublic;
        recipe.cookingTime = cookingTime;
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
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
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
        if (!user) return res.status(404).json({ message: 'User not found' });
        const isFavorite = user.favorites.has(recipeId);
        let isActivated = false;

        if (isFavorite) {
            user.favorites.delete(recipeId);
        } else {
            user.favorites.set(recipeId, true);
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
        if (!user) return res.status(404).json({ message: 'User not found' });
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        const isLiked = user.liked.has(recipeId);
        let isActivated = false;

        if (isLiked) {
            recipe.likes -= 1;
            user.liked.delete(recipeId);
        } else {
            recipe.likes += 1;
            user.liked.set(recipeId, true);
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
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        const commentId = getObjectId();

        recipe.comments.set(commentId, {
            _id: commentId,
            username: name,
            parentId: parentId,
            content: content,
            user: userId
        });

        await recipe.save();

        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.commented.set(recipeId, true);
        await user.save();

        res.status(201).json([...recipe.comments.values()]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecipeComments = async (req, res) => {
    const { recipeId } = req.params;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        for (const comment of recipe.comments.values()) {
            const user = await User.findById({ _id: comment.user });

            if (user.name !== comment.username) {
                comment.username = user.name;
                await recipe.save();
            }
        }

        res.status(200).json([...recipe.comments.values()]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const { recipeId, commentId } = req.params;
    const { content } = req.body;

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        const comment = recipe.comments.get(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.content = content;
        comment.timestamp = new Date();
        await recipe.save();
        res.status(200).json([...recipe.comments.values()]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    const { userId } = req.user;
    const { recipeId, commentId } = req.params;
    let topLevelCommentId = commentId; // topLevelCommentId is an ID of the comment the user wants to delete
    const stack = []; // Used to track sub comments that need to be checked

    try {
        const recipe = await Recipe.findById({ _id: recipeId });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        recipe.comments.delete(commentId);

        // Find all sub comments of the comment
        while (topLevelCommentId !== null) {
            for (const comment of recipe.comments.values()) {
                const parentId = comment.parentId;

                // Check if current comment in loop is a sub comment of the current comment
                if (parentId && parentId.equals(topLevelCommentId)) {
                    const subCommentId = comment._id;
                    stack.push(subCommentId);
                    recipe.comments.delete(subCommentId);
                }
            }

            // Move to the next nested comment, or break while loop
            if (stack.length !== 0) {
                topLevelCommentId = stack.pop();
            } else {
                topLevelCommentId = null;
            }
        }

        await recipe.save();
        res.status(200).json([...recipe.comments.values()]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchRecipes = async (req, res) => {
    const { page, limit } = req.params;
    const { title, cookingTime, difficulty, category, likes, startDate, endDate } = req.body;
    const query = { isPublic: true };

    if (title && title.trim()) query.title = { $regex: title.trim(), $options: 'i' };
    if (cookingTime) query.cookingTime = { $lte: cookingTime };
    if (likes) query.likes = { $gte: likes };
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

exports.getFavoriteRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const startIndex = (page - 1) * limit;
        const recipesIds = [...user.favorites.keys()].slice(startIndex, startIndex + limit);
        const recipes = [];

        for (let i = 0; i < recipesIds.length; i++) {
            const recipe = await Recipe.findById({ _id: recipesIds[i] });

            if (!recipe) {
                user.favorites.delete(recipesIds[i]);
                await user.save();
            } else {
                recipes.push(recipe);
            }
        }

        res.status(200).json({ recipes, totalPages: Math.ceil(user.favorites.size / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLikedRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const startIndex = (page - 1) * limit;
        const recipesIds = [...user.liked.keys()].slice(startIndex, startIndex + limit);
        const recipes = [];

        for (let i = 0; i < recipesIds.length; i++) {
            const recipe = await Recipe.findById({ _id: recipesIds[i] });

            if (!recipe) {
                user.liked.delete(recipesIds[i]);
                await user.save();
            } else {
                recipes.push(recipe);
            }
        }

        res.status(200).json({ recipes, totalPages: Math.ceil(user.liked.size / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentedRecipes = async (req, res) => {
    const { userId } = req.user;
    const { page, limit } = req.params;

    try {
        const user = await User.findById({ _id: userId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        const startIndex = (page - 1) * limit;
        const recipeIds = [...user.commented.keys()].slice(startIndex, startIndex + limit);
        let isEqual = false;
        const recipes = [];

        for (let i = 0; i < recipeIds.length; i++) {
            const recipe = await Recipe.findById({ _id: recipeIds[i] });

            if (!recipe) {
                user.commented.delete(recipeIds[i]);
                await user.save();
                continue;
            }

            for (const comment of recipe.comments.values()) {
                if (comment.user.equals(userId)) {
                    isEqual = true;
                    break;
                }
            }

            if (!isEqual) {
                user.commented.delete(recipeIds[i]);
                await user.save();
            } else {
                recipes.push(recipe);
                isEqual = false;
            }
        }

        res.status(200).json({ recipes, totalPages: Math.ceil(user.commented.size / limit), currentPage: parseInt(page) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};