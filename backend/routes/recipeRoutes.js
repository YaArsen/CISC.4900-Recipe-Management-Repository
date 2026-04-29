const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, recipeController.postRecipe);
router.get('/:page/:limit', auth, recipeController.getAllUserRecipes);
router.get('/:recipeId', auth, recipeController.getRecipe);
router.get('/:recipeId/recipe/isActivated', auth, recipeController.isActivated);
router.put('/:recipeId', auth, recipeController.updateRecipe);
router.delete('/:recipeId/:page/:limit', auth, recipeController.deleteRecipe);

router.put('/:recipeId/favorites', auth, recipeController.toggleFavorite);
router.put('/:recipeId/likes', auth, recipeController.toggleLike);

router.post('/:recipeId/comments', auth, recipeController.postComment);
router.get('/:recipeId/recipe/comments', auth, recipeController.getRecipeComments);
router.put('/:recipeId/comments/:commentId', auth, recipeController.updateComment);
router.delete('/:recipeId/comments/delete-comment/:commentId', auth, recipeController.deleteComment);

router.get('/favorite-recipes/:page/:limit', auth, recipeController.getFavoriteRecipes);
router.get('/liked-recipes/:page/:limit', auth, recipeController.getLikedRecipes);
router.get('/commented-recipes/:page/:limit', auth, recipeController.getCommentedRecipes);

router.post('/search/:page/:limit', auth, recipeController.searchRecipes);

module.exports = router;