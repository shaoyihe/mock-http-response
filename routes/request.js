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
        if (req.acceptJson()) {
            next();
        } else {
            res.render("request", {title: "请求"})
        }
    }
).post(function (req, res, next) {
        var body = {};
        for (let v in req.body) {
            el(body, v, req.body[v]);
        }
        db.Request.create(body).then(function (request) {
            var requestParams = body.requestParam.map((v, i)=> {
                v.order = i;
                v.requestId = request.id;
                return v;
            });
            db.RequestParam.bulkCreate(requestParams).then(function () {
                res.json({code: 0});
            }).catch(function (err) {
                next(err);
            });
        }).catch(function (err) {
            next(err);
        });
    }
);

module.exports = router;
