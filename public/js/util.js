/**
 * Created by heshaoyi on 4/24/16.
 */

"use strict";

function messagePro(data) {
    if (data.code !== 0) {
        alert(data.message);
        return false;
    }
    return true;
}