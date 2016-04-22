/**
 * Created by heshaoyi on 4/22/16.
 */

"use strict";

var r = ["test", undefined].map(function (v) {
    if (v) {
        return v;
    }
});

console.log(r);