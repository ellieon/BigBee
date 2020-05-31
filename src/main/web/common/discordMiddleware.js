"use strict";
exports.__esModule = true;
exports.DiscordMiddleware = void 0;
var jwtHelper_1 = require("web/common/jwtHelper");
var environmentHelper_1 = require("common/environmentHelper");
var logger = require("winston");
var DiscordMiddleware = /** @class */ (function () {
    function DiscordMiddleware() {
    }
    DiscordMiddleware.createHandler = function (callback) {
        return function (req, res, next) {
            var token = jwtHelper_1.JwtHelper.readBearerTokenFromRequest(req);
            if (!token) {
                logger.info('No token found, redirect to login');
                res.redirect(environmentHelper_1.EnvironmentHelper.getBaseURL() + "/login?callback=" + callback);
            }
            else {
                res.locals.SESSION_ID = token;
                next();
            }
        };
    };
    return DiscordMiddleware;
}());
exports.DiscordMiddleware = DiscordMiddleware;
