const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post('/create-post', feedController.createPost);

router.get('/post/:postId', feedController.getPost);

router.post('/post/:postId', feedController.createComment);

router.post('/post/:postId/voted', feedController.voted);

router.get('/posts/r/:category', feedController.getCategory);

module.exports = router;
