const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.logIn);
router.delete('/delete', auth, authController.deleteAccount);
router.put('/reset-password', authController.resetPassword);

router.get('/:userId', auth, authController.getRecipeUsername);
router.put('/update-name', auth, authController.updateName);
router.put('/update-email', auth, authController.updateEmail);
router.put('/update-password', auth, authController.updatePassword);

module.exports = router;