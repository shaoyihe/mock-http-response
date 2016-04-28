/**
 * Created by heshaoyi on 4/24/16.
 */

"use strict";

function messagePro(data) {
    if (data.code !== 0) {
        bootbox.alert({
            size: 'small',
            message: data.message
        });
        return false;
    }
    return true;
}