"use strict";
exports.__esModule = true;
exports.BotExtension = exports.Extension = void 0;
var path = require("path");
var requireDirectory = require("require-directory");
var Extension;
(function (Extension) {
    var fileExtension = path.extname(__filename).slice(1);
    var options = {
        extensions: [fileExtension],
        recurse: true,
        visit: function (obj) {
            return (typeof obj === 'object' && obj["default"] !== undefined) ? obj["default"] : obj;
        }
    };
    var implementations = [];
    function GetImplementations() {
        findAll(__dirname);
        return implementations;
    }
    Extension.GetImplementations = GetImplementations;
    function register(ctor) {
        implementations.push(ctor);
        return ctor;
    }
    Extension.register = register;
    function findAll(path) {
        requireDirectory(module, path, options);
    }
})(Extension = exports.Extension || (exports.Extension = {}));
var BotExtension = /** @class */ (function () {
    function BotExtension() {
    }
    BotExtension.prototype.getClient = function () {
        return this.client;
    };
    BotExtension.prototype.setClient = function (client) {
        this.client = client;
    };
    return BotExtension;
}());
exports.BotExtension = BotExtension;
