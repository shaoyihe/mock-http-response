/**
 * Created by heshaoyi on 4/24/16.
 */

"use strict";

module.exports = function (req, res, next) {
    if (["/login", "/register"].indexOf(req.path) >= 0 || req.path.startsWith("/apis")) {
        next();
        return;
    }
    if (req.session.user) {
        res.locals.user = req.session.user;
        next();
    } else if (req.acceptJson()) {
        res.json({code: 2, message: "需要登录"});
    } else {
        res.redirect(303, "/login");
    }
};