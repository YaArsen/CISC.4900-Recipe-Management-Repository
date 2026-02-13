const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete', auth, authController.delete);

module.exports = router;