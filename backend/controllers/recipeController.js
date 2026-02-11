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
    res.status(201).json({ message: 'Recipe added successfully', recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUserRecipes = async (req, res) => {
  const { userId } = req.user;

  try {
    let recipes = await Recipe.find();
    recipes = recipes.filter(recipe => userId.toString() === recipe.user.toString());
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
    res.status(200).json({ message: 'Recipe updated successfully', recipes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    await Recipe.findByIdAndDelete({ _id: recipeId });
    const recipes = await Recipe.find();
    res.status(200).json({ message: 'Recipe deleted successfully', recipes });
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

    if (isLiked) {
      recipe.likes -= 1;
      user.liked.pull(recipeId);
    } else {
      recipe.likes += 1;
      user.liked.push(recipeId);
    }

    await recipe.save();
    await user.save();
    res.status(200).json(recipe);
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
      content: content,
      user: userId,
      parentId: parentId,
      timestamp: new Date()
    });

    await recipe.save();

    //const user = await User.findById({ _id: userId });
    //if (!user.commented.get(recipeId)) user.commented.set(recipeId, []);
    //user.commented.get(recipeId).push(comment._id);
    //await user.save();

    res.status(201).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById({ _id: recipeId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe.comments);
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
  const { recipeId, commentId } = req.params;
  let topLevelComment = commentId;
  const stack1 = [];
  const stack2 = [topLevelComment];

  try {
    const recipe = await Recipe.findById({ _id: recipeId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    const comment = recipe.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    while (topLevelComment !== null) {
      for (let i = 0; i < recipe.comments.length; i++)
        if (equals(topLevelComment, recipe.comments[i].parentId)) {
          stack1.push(recipe.comments[i]._id);
          stack2.push(recipe.comments[i]._id);
        }

      if (stack1.length !== 0) {
        topLevelComment = stack1.pop();
      } else {
        topLevelComment = null;
      }
    }
    
    while (stack2.length !== 0) {
      const commentId = stack2.pop();

      for (let i = 0; i < recipe.comments.length; i++)
        if (equals(recipe.comments[i]._id, commentId)) {
          recipe.comments[i].deleteOne();
          break;
        }
    }

    await recipe.save();

    res.status(200).json(recipe.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchRecipes = async (req, res) => {
  const { title, cookingTime, difficulty, category, likes } = req.body;
  const query = { isPublic: true };

  if (title.trim()) query.title = { $regex: title.trim(), $options: 'i' };
  if (cookingTime !== '' && !isNaN(cookingTime) && Number(cookingTime) >= 0) query.cookingTime = { $lte: Number(cookingTime) };
  if (difficulty) query.difficulty = difficulty;
  if (category) query.category = category;
  if (likes !== '' && !isNaN(likes) && Number(likes) >= 0) query.likes = { $gte: Number(likes) };

  const hasFilters =
    title.trim() || 
    (cookingTime !== '' && !isNaN(cookingTime) && Number(cookingTime) >= 0) || 
    difficulty || 
    category || 
    (likes !== '' && !isNaN(likes) && Number(likes) >= 0);

  if (!hasFilters) return res.status(400).json({ message: 'Enter some text or apply at least one filter' });

  try {
    const recipes = await Recipe.find(query);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};