const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, recipeController.postRecipe);
router.get('/', auth, recipeController.getAllUserRecipes);
router.get('/isActivated/:recipeId', auth, recipeController.isActivated);
router.get('/:recipeId', auth, recipeController.getRecipe);
router.put('/:recipeId', auth, recipeController.updateRecipe);
router.delete('/:recipeId', auth, recipeController.deleteRecipe);

router.post('/:recipeId/likes', auth, recipeController.toggleLike);

router.post('/:recipeId/comments', auth, recipeController.postComment);
router.put('/:recipeId/comments/:commentId', auth, recipeController.updateComment);
router.delete('/:recipeId/comments/:commentId', auth, recipeController.deleteComment);

router.post('/search', auth, recipeController.searchRecipes);

module.exports = router;