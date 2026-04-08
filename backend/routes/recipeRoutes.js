const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, recipeController.postRecipe);
router.get('/:page/:limit', auth, recipeController.getAllUserRecipes);
router.get('/:recipeId', auth, recipeController.getRecipe);
router.put('/:recipeId', auth, recipeController.updateRecipe);
router.delete('/:recipeId/:page/:limit', auth, recipeController.deleteRecipe);

router.put('/:recipeId/likes', auth, recipeController.toggleLike);

router.post('/:recipeId/comments', auth, recipeController.postComment);
router.put('/:recipeId/comments/:commentId', auth, recipeController.updateComment);
router.delete('/:recipeId/comments/delete-comment/:commentId', auth, recipeController.deleteComment);

router.post('/search/:page/:limit', auth, recipeController.searchRecipes);

module.exports = router;