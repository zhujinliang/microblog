
exports.init = function(app) {
  var crypto = require('crypto');
  var user = require('./user');
  var User = require('../models/user.js');
  var users = {
    'jlzhu': {
      name: 'Jinliang Zhu',
      age: 23,
      website: 'http://zhujinliang.github.io'
    },
  };

  app.get('/', function index(req, res) {
    res.render('index', { title: '首页'});
  });

  app.get('/u/:user', function user(req, res) {
  
  });

  app.post('/post', function post(req, res) {
  
  });

  app.get('/reg', function reg(req, res) {
    res.render('reg', {
      title: '用户注册',
    });
  });

  app.post('/reg', function doReg(req, res) {
    // Check if the two password is the same.
    if (req.body['password-repeat'] != req.body['password']) {
      req.flash('error', '两次输入的密码不一致');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
      name: req.body.username,
      password: req.body.password,
    });

    // Check if the username exists.
    User.get(newUser.name, function(err, user) {
      if (user) {
        err = 'Username already exists.';
      }
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      // If not exists.
      newUser.save(function(err) {
        req.flash('error', err);
        return res.redirect('/reg');
      });
      req.session.user = newUser;
      req.flash('success', '注册成功');
      res.redirect('/');
    });
  });

  app.get('/login', function login(req, res) {
  
  });

  app.post('/login', function doLogin(req, res) {
  
  });

  app.get('/logout', function logout(req, res) {
  
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
