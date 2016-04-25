/**
 * Created by heshaoyi on 4/22/16.
 */

"use strict";

var express = require('express');
var el = require('node-el');
var _ = require('lodash');
var db = require('../util/db');
var message = require('../util/message');
var router = express.Router();


router.route("/").get(function (req, res, next) {
    if (req.acceptJson()) {
        db.Request.findAll({
            where: {
                projectId: req.query.projectId
            },
            order: "updatedAt desc,id desc"
        }).then(function (reqs) {
            res.json(_.defaults({data: reqs}, message.success));
        }).catch(function (err) {
            next(err);
        });
    } else {
        next();
    }
}).post(function (req, res, next) {
    db.Request.create(req.body).then(function (request) {
        res.json(_.defaults({data: request}, message.success))
    }).catch(function (err) {
        next(err);
    });
});

router.route('/((\\d+))').get(function (req, res, next) {
        var requestId = req.params[0];
        if (req.acceptJson()) {
            db.Request.findById(requestId).then(function (request) {
                db.RequestParam.findAll({
                    where: {
                        requestId: requestId
                    },
                    order: " 'order' "
                }).then(function (requestParams) {
                    request.setDataValue("requestParams", requestParams);
                    res.json(_.defaults({data: request}, message.success));
                }).catch(function (err) {
                    next(err);
                });

            }).catch(function (err) {
                next(err);
            });
        } else {
            res.render("request", {title: "请求"});
        }
    }
).post(function (req, res, next) {
    var body = {};
    for (let v in req.body) {
        el(body, v, req.body[v]);
    }
    var requestId = req.params[0];

    db.Request.findById(requestId).then(function (request) {
        db.sequelize.transaction((t)=> {
            return db.RequestParam.destroy({
                where: {
                    requestId: requestId
                },
                transaction: t
            }).then(function () {
                return request.update(body, {transaction: t}).then(function () {
                    var requestParams = body.requestParam.map((v, i)=> {
                        v.order = i;
                        v.requestId = requestId;
                        return v;
                    });
                    return db.RequestParam.bulkCreate(requestParams, {transaction: t});
                });
            });
        }).then(function (result) {
            res.json(message.success);
        }).catch(function (err) {
            next(err);
        });
    });
});

/**
 * 删除请求
 */
router.post("/((\\d+))/delete", function (req, res, next) {
    var requestId = req.params[0];
    db.sequelize.transaction((t)=> {
        return db.Response.destroy({
            where: {
                requestId: requestId
            }, transaction: t
        }).then(function () {
            return db.Request.destroy({
                where: {
                    projectId: projectId
                },
                transaction: t
            });
        });
    }).then(function (result) {
        res.json(message.success);
    }).catch(function (err) {
        next(err);
    });

})
;

module.exports = router;
