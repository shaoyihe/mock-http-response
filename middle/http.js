/**
 * Created by heshaoyi on 4/24/16.
 */

"use strict";

module.exports = function (req, res, next) {
    req.acceptJson = function () {
        return this.accepts(['html', 'json']) === "json";
    };
    next();
};