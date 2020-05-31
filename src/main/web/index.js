"use strict";
exports.__esModule = true;
exports.WebService = void 0;
var express = require("express/lib/express");
var spotify_1 = require("web/routes/spotify");
var discord_1 = require("web/routes/discord");
var routes_1 = require("web/routes/");
var cookieParser = require("cookie-parser");
var logger = require("winston");
var WebService = /** @class */ (function () {
    function WebService() {
        this.port = process.env.PORT || 3000;
        this.app = express();
    }
    WebService.prototype.init = function () {
        var _this = this;
        this.app.use(cookieParser());
        this.app.use(spotify_1["default"]);
        this.app.use(discord_1["default"]);
        this.app.use(routes_1["default"]);
        this.app.listen(this.port, function () { return logger.info("Server is listening on port " + _this.port); });
    };
    return WebService;
}());
exports.WebService = WebService;
