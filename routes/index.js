var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var db = require('../util/db');
var message = require('../util/message');
var login_auth = require('../middle/login-auth');

router.use(function (req, res, next) {
    if (req.session.user && ["/login", "/register"].indexOf(req.path) != -1) {
        res.redirect(303, "/");
    } else {
        next();
    }
});

router.route("/login").get(function (req, res, next) {
    res.render('login', {title: '登录'});
}).post(function (req, res, next) {
    //login by name
    var body = req.body;
    (body.loginType === "1" ? db.User.findOne({  //login by name
        where: {
            name: body.name,
            password: sha1(body.password)
        }
    }) :
        db.User.findOne({      //login by email
            where: {
                email: body.email,
                password: sha1(body.password)
            }
        })).then((user)=> {
        if (user) {
            req.session.user = user;
            res.json(message.success);
        } else {
            res.json({code: 1, message: `${body.loginType === "1" ? "用户名" : "邮箱"}或密码错误`});
        }
    }).catch((error)=> {
        next(error);
    });
});

router.route("/register").get(function (req, res, next) {
    res.render('register', {title: '注册'});
}).post(function (req, res, next) {
    req.body.password = sha1(req.body.password);
    db.User.create(req.body)
        .then((user)=> {
            req.session.user = user;
            res.json({code: 0})
        }).catch((error)=> {
        next(error);
    });
});


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect(303, "/login");
});

module.exports = router;
