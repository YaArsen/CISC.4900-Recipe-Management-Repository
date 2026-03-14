const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete', auth, authController.deleteAccount);
router.put('/reset', authController.passwordReset);

router.put('/update-name', auth, authController.updateName);
router.put('/update-email', auth, authController.updateEmail);
router.put('/update-password', auth, authController.updatePassword);

router.get('/timestamp', auth, authController.getTimestamp);
router.get('/email', auth, authController.getUserEmail);
router.get('/username', auth, authController.getUsername);

module.exports = router;