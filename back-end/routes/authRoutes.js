const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete', verifyToken, authController.delete);

module.exports = router;