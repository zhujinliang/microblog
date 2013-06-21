
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
    Post.get(null, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('index', {
        title: '首页',
        posts: posts
      });

    });
  });

  app.get('/u/:user', function user(req, res) {
    User.get(req.params.user, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/');
      }
      Post.get(user.name, function(err, posts) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        res.render('user', {
          title: user.name,
          posts: posts,
        });
      });
    });
  
  });

  app.post('/post', checkLogin);
  app.post('/post', function post(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发表成功');
      res.redirect('/u/' + currentUser.name);
    });
  
  });

  app.get('/reg', checkNotLogin);
  app.get('/reg', function reg(req, res) {
    res.render('reg', {
      title: '用户注册',
    });
  });

  app.post('/reg', checkNotLogin);
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

  app.get('/login', checkNotLogin);
  app.get('/login', function login(req, res) {
    res.render('login', {title: '用户登入'});
  });

  app.post('/login', checkNotLogin);
  app.post('/login', function doLogin(req, res) {
    // Generate the token.
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '用户密码错误');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登入成功');
      req.redirect('/');
    });
  });

  app.get('/logout', checkLogin);
  app.get('/logout', function logout(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
  });

  function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash('error', '未登入');
      return res.redirect('/login');
    }
    next();
  }

  function checkNotLogin(req, res, next) {
    if (req.session.user) {
      req.flash('error', '已登入');
      return res.redirect('/');
    }
    next();
  }

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
