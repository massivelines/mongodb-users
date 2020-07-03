const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is',
    });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), comment.save(), blogPost.save()]).then(() =>
      done()
    );
  });

  // it.only will only run this test
  // Note: see .exec() legacy mongoose tutorials .exec() = .then()
  it('saves a relation between a user and a blogpost', (done) => {
    // In User collection
    // Find the first record with criteria
    User.findOne({ name: 'Joe' })
      // Modifier to enhance the query
      // populate resolves the 'blogPost' relationship
      .populate('blogPosts')
      // .then() executes the query
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great');
        done();
      });
  });

  it('saves a full relation graph', (done) => {
    User.findOne({ name: 'Joe' })
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            modal: 'user',
          },
        },
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(
          user.blogPosts[0].comments[0].content === 'Congrats on great post'
        );
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');

        done();
      });
  });
});
