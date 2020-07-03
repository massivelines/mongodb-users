const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: String,
  user: {
    type: Schema.Types.ObjectId,
    // ref has to equal mongoose.model from user.js schema so User will not work
    ref: 'user',
  },
});

const BlogPost = mongoose.model('comment', CommentSchema);

module.exports = BlogPost;
