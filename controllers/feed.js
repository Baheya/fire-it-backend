const { validationResult } = require('express-validator/check');

const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res
        .status(200)
        .json({ message: 'Posts fetched successfully.', posts: posts });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .populate('comments')
    .then(post => {
      if (!post) {
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Post fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//plugs into to database schema, must have same properties

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const category = req.body.category;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    author: { name: 'Baheya' },
    votes: 0,
    category: category
  });
  post
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createComment = (req, res, next) => {
  const content = req.body.content;
  const postId = req.body.postId;
  const author = req.body.author;
  console.log(author);
  const comment = new Comment({
    content: content,
    postId: postId,
    author: author
  });
  comment
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Comment created successfully!',
        comment: result
      });
    })
    .then(
      Post.findByIdAndUpdate(postId, { $push: { comments: comment } }).then(
        post => post.comments.push(comment)
      )
    )
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.voted = (req, res, next) => {
  const postId = req.body.postId;
  const votes = req.body.votes;
  console.log(postId, votes);
  Post.findByIdAndUpdate(postId, { votes: votes })
    .then(post => console.log(post))
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCategory = (req, res, next) => {
  const category = req.params.category;
  console.log(category);
  Post.find({ category: category })
    .then(post => {
      if (!post) {
        const error = new Error('No posts in this category.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: 'Posts fetched.', post: post });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
