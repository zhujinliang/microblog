var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
}
module.exports = User;

User.prototype.save = function save(callback) {
  // Save into Mongodb document.
  var user = {
    name: this.name,
    password: this.password,
  };
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // Read the collection of users.
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // Add index for attribute name.
      collection.ensureIndex('name', {unique: true});
      // Write to user document.
      collection.insert(user, {safe: true}, function(err, user) {
        mongodb.close();
        callback(err, user);
      });
    });
  });
};

User.get = function get(username, callback) {
  mongodb.open(function(err, db){
    if (err) {
      return callback(err);
    }
    // Read the collection of users.
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // Find the document that name = username.
      collection.findOne({name: username}, function(err, doc) {
        mongodb.close();
        if (doc) {
          // Tranfer to User object.
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};
