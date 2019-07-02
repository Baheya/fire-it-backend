const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    author: {
      type: Object,
      required: true
    },
    votes: {
      type: Number,
      required: false
    },
    category: {
      type: Object,
      default: 'general',
      required: false
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
