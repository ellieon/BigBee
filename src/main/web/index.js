"use strict";
exports.__esModule = true;
exports.WebService = void 0;
var express = require("express/lib/express");
var hello_1 = require("./routes/hello");
var spotify_1 = require("./routes/spotify");
var discord_1 = require("./routes/discord");
var WebService = /** @class */ (function () {
    function WebService() {
        this.port = process.env.PORT || 3000;
        this.app = express();
    }
    WebService.prototype.init = function () {
        var _this = this;
        this.app.use(hello_1["default"]);
        this.app.use(spotify_1["default"]);
        this.app.use(discord_1["default"]);
        this.app.listen(this.port, function () { return console.log("Server is listening on port " + _this.port); });
    };
    return WebService;
}());
exports.WebService = WebService;
