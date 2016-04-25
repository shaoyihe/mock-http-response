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

/**
 * 删除项目
 */
router.post("/((\\d+))/delete", function (req, res, next) {
    var projectId = req.params[0];
    db.Request.findAll({
        where: {
            projectId: projectId
        },
        attributes: ["id"]
    }).then(function (requests) {
        db.sequelize.transaction((t)=> {
            return db.Response.destroy({
                where: {
                    requestId: {
                        $in: requests.map((a)=>a.id)
                    }
                },
                transaction: t
            }).then(function () {
                return db.Request.destroy({
                    where: {
                        projectId: projectId
                    },
                    transaction: t
                }).then(()=> {
                    return db.Project.destroy({
                        where: {id: projectId},
                        transaction: t
                    });
                });
            });
        }).then(function (result) {
            res.json(message.success);
        }).catch(function (err) {
            next(err);
        });
    }).catch(function (err) {
        next(err);
    });

});

module.exports = router;
