const mongoose = require('mongoose');
const PostSchema = require('./post');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters.',
    },
  },
  // postCount: Virtual Type below
  posts: [PostSchema], //subdocuments, left for only example
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blogPost',
    },
  ],
});

// don't use arrow function in get so "this" will reference UserSchema
UserSchema.virtual('postCount').get(function () {
  return this.posts.length;
});

// Middleware
// When removing a user, remove all blog posts and comments
// called before "Remove Event" is ran
UserSchema.pre('remove', function (next) {
  // Reference BlogPost schema/model without importing it
  // keeps from having circular dependencies
  // and keeps BlogPost in control of its middleware
  // without issue of when everything will fire between User and BlogPost
  const BlogPost = mongoose.model('blogPost');

  // when remove is completed next() is called so the next remove can start (synchronous)
  BlogPost.remove({ _id: { $in: this.blogPosts } }).then(() => next());

  // Notes: 
  // - Transactions might clean up code
  // - Don't use js loops to update multiple data
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
