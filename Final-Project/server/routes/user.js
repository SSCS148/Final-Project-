const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); // Import correct du contrôleur user
const commentController = require('../controllers/comment'); // Import correct du contrôleur comment

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/check-email', userController.checkEmail);
router.get('/all', userController.getAllUsers);

// Routes pour les commentaires et les likes
router.post('/comments', commentController.createComment);
router.post('/like', commentController.likeComment);
router.get('/comments', commentController.getAllComments);
router.post('/refresh-token', userController.refreshToken);

module.exports = router;