const express = require('express');
const recipeController = require('../controllers/recipeController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/', verifyToken, recipeController.postRecipe);
router.get('/', verifyToken, recipeController.getAllUserRecipes);
router.get('/:recipeId', verifyToken, recipeController.getRecipe);
router.put('/:recipeId', verifyToken, recipeController.updateRecipe);
router.delete('/:recipeId', verifyToken, recipeController.deleteRecipe);

router.post('/:recipeId/likes', verifyToken, recipeController.toggleLike);

router.post('/:recipeId/comments', verifyToken, recipeController.postComment);
router.put('/:recipeId/comments/:commentId', verifyToken, recipeController.updateComment);
router.delete('/:recipeId/comments/:commentId', verifyToken, recipeController.deleteComment);

router.post('/search', verifyToken, recipeController.searchRecipes);

module.exports = router;