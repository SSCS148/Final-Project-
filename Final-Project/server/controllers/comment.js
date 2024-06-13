const Comment = require('../models/Comment');
const jwt = require('jsonwebtoken');

exports.createComment = async (req, res) => {
    const { comment } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'secretKey');
        const userId = decoded.id;

        const newComment = await Comment.create({ comment, userId });
        res.json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.likeComment = async (req, res) => {
  try {
    const commentId = req.body.commentId;
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).json({ message: error.message });
  }
};