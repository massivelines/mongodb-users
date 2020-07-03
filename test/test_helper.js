const mongoose = require('mongoose');

before((done) => {
  mongoose.connect('mongodb://localhost/users_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Open connection when tests are run
  mongoose.connection
    .once('open', () => {
      done();
    })
    .on('error', (error) => {
      console.log('Warning', error);
    });
});

// Before each test drop collection
// done() is callback to say block is completed
// Note: mongodb normilizes colleciton names so blogPosts is converted to blogposts
beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;
  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});

// Snippet to loop over all collections
// beforeEach(function (done) {
//   function clearDB() {
//     for (var i in mongoose.connection.collections) {
//       mongoose.connection.collections[i].remove(function () {});
//     }
//     return done();
//   }

//   if (mongoose.connection.readyState === 0) {
//     mongoose.connect(config.db.test, function (err) {
//       if (err) {
//         throw err;
//       }
//       return clearDB();
//     });
//   } else {
//     return clearDB();
//   }
// });
