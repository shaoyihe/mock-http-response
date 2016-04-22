/**
 * Created by heshaoyi on 4/22/16.
 */

"use strict";

var express = require('express');
var el = require('node-el');
var db = require('../util/db');
var router = express.Router();

/* GET users listing. */
router.post('/create', function (req, res, next) {
    var body = {};
    for (let v in req.body) {
        el(body, v, req.body[v]);
    }
    db.Request.create(body).then(function (request) {
        body.requestParam.forEach((v, i)=> {
            if (v.key) {
                v.order = i;
                var entity = db.RequestParam.build(v);
                entity.setRequest(request);
                entity.save().then(function () {
                    res.json({code: 1});
                });
            }
        });
    });
});

module.exports = router;
