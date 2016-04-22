/**
 * Created by heshaoyi on 4/21/16.
 */

"use strict";

//console.log(eval("this.x").call({x: "x"}));

eval.call("var t = this.x", {x: "33"});
console.log(t);