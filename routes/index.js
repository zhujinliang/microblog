
exports.init = function(app) {
  var user = require('./user');
  var users = {
    'jlzhu': {
      name: 'Jinliang Zhu',
      age: 23,
      website: 'http://zhujinliang.github.io'
    },
  };

  app.get('/', function index(req, res) {
    res.render('index', { title: 'Express' });
  });

  app.get('/users', user.list);

  app.get('/hello', function hello(req, res) {
    res.send('The time is '+ new Date().toString());
  });

  app.all('/user/:username', function(req, res, next) {
    // Check if the user exists.
    console.log('all method captured.');
    if (users[req.params.username]) {
      next();
    } else {
      next(new Error(req.params.username + ' does not exists.'));
    }
  });

  app.get('/user/:username', function(req, res) {
    // User exists, display the username.
    res.send(JSON.stringify(users[req.params.username]));
  });

  app.get('/list', function list(req, res) {
    res.render('list', {
      title: 'List', 
      items: [1991, 'jlzhu', 'express', 'Node.js']
    });
  });

}
