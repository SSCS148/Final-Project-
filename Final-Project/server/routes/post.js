const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('photo'), postController.createPost);
router.get('/', postController.getAllPosts);

module.exports = router;