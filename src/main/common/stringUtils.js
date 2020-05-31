"use strict";
exports.__esModule = true;
exports.format = void 0;
function format(input) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return input.replace(/{(\d+)}/g, function (match, index) {
        return typeof args[index] !== undefined
            ? args[index]
            : match;
    });
}
exports.format = format;
