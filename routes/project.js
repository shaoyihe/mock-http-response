/**
 * Created by heshaoyi on 4/24/16.
 */

"use strict";

var express = require('express');
var db = require('../util/db');
var message = require('../util/message');
var _ = require('lodash');
var router = express.Router();

router.route("/").get(function (req, res, next) {
    if (req.acceptJson()) {
        db.User.findById(res.locals.user.id).then(function (user) {
            user.getProjects().then(function (projects) {
                res.json(_.defaults({data: projects}, message.success));
            }).catch(function (err) {
                next(err);
            });
        }).catch(function (err) {
            next(err);
        });
    } else {
        next();
    }
}).post(function (req, res, next) { //新建项目
    db.User.findById(res.locals.user.id).then(function (user) {
        db.Project.create(req.body).then(function (project) {
            project.addUser(user).then(function () {
                res.json(_.defaults({data: project}, message.success));
            }).catch(function (err) {
                next(err);
            });
        }).catch(function (err) {
            next(err);
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
