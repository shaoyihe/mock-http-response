/**
 * Created by heshaoyi on 4/22/16.
 */

"use strict";

var express = require('express');
var db = require('../util/db');
var router = express.Router();

/**
 *
 */
router.all('/((\\d+))/((*+))', function (req, res, next) {
    var prjId = req.params[0];
    var path = req.params[1];
    db.Request.findOne({
        where: {
            method: req.method,
            url: "/" + path,
            projectId: prjId
        }
    }).then(function (req) {
        if (req) {
            res.json(JSON.parse(req.response_eg));
        } else {
            next();
        }
    }).error(function (err) {
        next(err);
    });
});

module.exports = router;
