"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var environmentHelper_1 = require("../../common/environmentHelper");
var database_1 = require("common/database");
var discordMiddleware_1 = require("web/common/discordMiddleware");
var discordHelper_1 = require("common/discordHelper");
var logger = require("winston");
var scopes = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing'
];
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: environmentHelper_1.EnvironmentHelper.getSpotifyClientId(),
    clientSecret: environmentHelper_1.EnvironmentHelper.getSpotifyClientSecret(),
    redirectUri: environmentHelper_1.EnvironmentHelper.getSpotifyCallbackUrl()
});
var database = new database_1.DatabaseHelper();
var spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, 'some-state');
// tslint:disable-next-line:no-default-export
exports["default"] = express.Router()
    .get('/spotify-login', discordMiddleware_1.DiscordMiddleware.createHandler('spotify-login'), function (req, res) {
    res.redirect(spotifyAuthUrl);
})
    .get('/callback', discordMiddleware_1.DiscordMiddleware.createHandler('spotify-login'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, refreshDate, userId, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, spotifyApi.authorizationCodeGrant(req.query.code)];
            case 1:
                data = _a.sent();
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);
                refreshDate = new Date();
                refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10);
                return [4 /*yield*/, discordHelper_1.DiscordHelper.getUserId(res.locals.SESSION_ID)];
            case 2:
                userId = _a.sent();
                return [4 /*yield*/, database.setCurrentSpotifyKey(userId, data.body.access_token, data.body.refresh_token, refreshDate)["catch"](logger.error)];
            case 3:
                _a.sent();
                res.redirect(environmentHelper_1.EnvironmentHelper.getBaseURL());
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                res.send(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); }).get('/disconnect', discordMiddleware_1.DiscordMiddleware.createHandler('disconnect'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, discordHelper_1.DiscordHelper.getUser(res.locals.SESSION_ID)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, database.deleteUser(user.id)];
            case 2:
                _a.sent();
                res.send("User " + user.username + " has been deleted from the database");
                return [2 /*return*/];
        }
    });
}); });
