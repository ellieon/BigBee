"use strict";
exports.__esModule = true;
exports.JwtHelper = void 0;
var jwt = require("jsonwebtoken");
var logger = require("winston");
var JwtHelper = /** @class */ (function () {
    function JwtHelper() {
    }
    JwtHelper.createBearerToken = function (bearerToken) {
        return jwt.sign({ bearerToken: bearerToken }, this.jwtKey, {
            algorithm: 'HS256',
            expiresIn: this.jwtExpiry
        });
    };
    JwtHelper.readBearerTokenFromRequest = function (req) {
        try {
            var token = jwt.verify(req.cookies.SESSION_ID, this.jwtKey);
            return token.bearerToken;
        }
        catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                logger.info('Invalid JWT Token');
            }
            return undefined;
        }
    };
    JwtHelper.saveBearerTokenToCookie = function (res, token) {
        res.cookie('SESSION_ID', token, { maxAge: this.jwtExpiry * 1000 });
    };
    JwtHelper.jwtKey = 'SUPER_SECRET_KEY';
    JwtHelper.jwtExpiry = 300;
    return JwtHelper;
}());
exports.JwtHelper = JwtHelper;
