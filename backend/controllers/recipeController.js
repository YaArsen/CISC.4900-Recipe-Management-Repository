const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.postRecipe = async (req, res) => {
  const { userId, name } = req.user; // From the decoded JWT
  const { title, ingredients, instructions, photoReference, isPublic, cookingTime, category, difficulty } = req.body;

  try {
    const recipe = new Recipe({
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      photoReference: photoReference,
      isPublic: isPublic,
      cookingTime: cookingTime,
      category: category,
      difficulty: difficulty,
      likes: 0,
      comments: [],
      username: name,
      user: userId,
      timestamp: new Date()
    });

    await recipe.save();

    const recipes = await Recipe.find();
    res.status(201).json({ message: `Recipe '${recipe.title}' added successfully`, recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUserRecipes = async (req, res) => {
  const { userId } = req.user;

  try {
    const recipes = await Recipe.find({ user: userId });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.isActivated = async (req, res) => {
  const { userId } = req.user;
  const { recipeId } = req.params;

  try {
    const user = await User.findById({ _id: userId });
    if (user.liked.includes(recipeId)) return res.status(200).json(true);
    res.status(200).json(false);
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
  const { recipeId } = req.params;
  const { title, ingredients, instructions, photoReference, isPublic, cookingTime, category, difficulty } = req.body;

  try {
    const recipe = await Recipe.findById({ _id: recipeId });

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.photoReference = photoReference || recipe.photoReference;
    recipe.isPublic = isPublic;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.category = category;
    recipe.difficulty = difficulty;

    await recipe.save();

    const recipes = await Recipe.find();
    res.status(200).json({ message: `Recipe '${recipe.title}' updated successfully`, recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findByIdAndDelete({ _id: recipeId });
    const recipes = await Recipe.find();
    res.status(200).json({ message: `Recipe '${recipe.title}' deleted successfully`, recipes });
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
    if (!recipe) return res.status(404).json({ message: 'Recipe not found.' });
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
  const { name, userId } = req.user;
  const { content, parentId } = req.body;
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById({ _id: recipeId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.comments.push({
      username: name,
      parentId: parentId,
      content: content,
      user: userId,
      timestamp: new Date()
    });

    await recipe.save();

    const user = await User.findById({ _id: userId });
    if (!user.commented.has(recipeId)) user.commented.set(recipeId, 0);
    user.commented.get(recipeId)++;
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
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    const comment = recipe.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.content = content;
    await recipe.save();
    res.status(200).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const equals = (obj1, obj2) => {
    if (!obj1 && !obj2) {
        return true;
    } else if (!obj1 || !obj2) {
        return false;
    } else {
        return obj1.toString() === obj2.toString();
    }
};

exports.deleteComment = async (req, res) => {
  const { userId } = req.user;
  const { recipeId, commentId } = req.params;
  let topLevelCommentId = commentId;
  const stack1 = [];
  const stack2 = [topLevelCommentId];

  try {
    const recipe = await Recipe.findById({ _id: recipeId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    const comment = recipe.comments.id(topLevelCommentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    while (topLevelCommentId !== null) {
      for (let i = 0; i < recipe.comments.length; i++)
        if (equals(topLevelCommentId, recipe.comments[i].parentId)) {
          stack1.push(recipe.comments[i]._id);
          stack2.push(recipe.comments[i]._id);
        }

      if (stack1.length !== 0) {
        topLevelCommentId = stack1.pop();
      } else {
        topLevelCommentId = null;
      }
    }

    const count = recipe.comments.filter(comment => comment.user.toString() === userId.toString() && stack2.includes(comment._id)).count;
    const user = await User.findById({ _id: userId });
    const userNumberOfComments = user.commented.get(recipeId) -= count;
    if (userNumberOfComments === 0) user.commented.delete(recipeId);
    await user.save();

    while (stack2.length !== 0) recipe.comments.pull(stack2.pop());
    await recipe.save();

    res.status(200).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchRecipes = async (req, res) => {
    const { title, cookingTime, difficulty, category, likes, startDate, endDate } = req.body;
    const query = { isPublic: true };

    if (title.trim()) query.title = { $regex: title.trim(), $options: 'i' };
    if (cookingTime !== '' && !isNaN(cookingTime)) query.cookingTime = { $lte: Number(cookingTime) };
    if (likes !== '' && !isNaN(likes)) query.likes = { $gte: Number(likes) };
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

    const hasFilters = Object.keys(query).length > 1;
    if (!hasFilters) return res.status(400).json({ message: 'Enter some text or apply at least one filter' });

  try {
    const recipes = await Recipe.find(query).sort({ timestamp: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};