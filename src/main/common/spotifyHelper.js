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
exports.SpotifyHelper = void 0;
var database_1 = require("common/database");
var environmentHelper_1 = require("common/environmentHelper");
var SpotifyWebApi = require("spotify-web-api-node");
var request = require("request");
var logger = require("winston");
var SpotifyHelper = /** @class */ (function () {
    function SpotifyHelper() {
        this.spotifyConnection = undefined;
        this.spotifyApi = new SpotifyWebApi({
            clientId: environmentHelper_1.EnvironmentHelper.getSpotifyClientId(),
            clientSecret: environmentHelper_1.EnvironmentHelper.getSpotifyClientSecret(),
            redirectUri: environmentHelper_1.EnvironmentHelper.getSpotifyCallbackUrl()
        });
        this.db = new database_1.DatabaseHelper();
    }
    SpotifyHelper.getInstance = function () {
        if (!SpotifyHelper.instance) {
            SpotifyHelper.instance = new SpotifyHelper();
        }
        return SpotifyHelper.instance;
    };
    SpotifyHelper.prototype.checkConnection = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Checking connection for user " + userId);
                        _a = this;
                        return [4 /*yield*/, this.db.getSpotifyKeyForUser(userId)];
                    case 1:
                        _a.spotifyConnection = _b.sent();
                        if (!this.spotifyConnection) {
                            return [2 /*return*/];
                        }
                        this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken);
                        this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken);
                        if (!(this.spotifyConnection.expires <= new Date())) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.refreshTime(userId)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        logger.debug("SpotifyHelper: check connection complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    SpotifyHelper.prototype.refreshTime = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, refreshDate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Refreshing token for " + userId);
                        return [4 /*yield*/, this.spotifyApi.refreshAccessToken()["catch"](logger.error)];
                    case 1:
                        data = _a.sent();
                        refreshDate = new Date();
                        refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10);
                        this.spotifyConnection = new database_1.SpotifyConnection(data.body.access_token, data.body.refresh_token, refreshDate);
                        this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken);
                        this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken);
                        return [4 /*yield*/, this.db.updateSpotifyKeyForUser(userId, this.spotifyConnection.connectionToken, this.spotifyConnection.expires)["catch"](logger.error)];
                    case 2:
                        _a.sent();
                        logger.debug("SpotifyHelper: refresh token done");
                        return [2 /*return*/];
                }
            });
        });
    };
    SpotifyHelper.prototype.searchForTrack = function (searchQuery, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var trackData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Searching for track with search query: " + searchQuery + " and userId " + userId);
                        return [4 /*yield*/, this.checkConnection(userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.spotifyApi.searchTracks(searchQuery, { limit: 1 })["catch"](logger.error)];
                    case 2:
                        trackData = _a.sent();
                        logger.debug("SpotifyHelper: Searching for track done");
                        return [2 /*return*/, trackData];
                }
            });
        });
    };
    SpotifyHelper.prototype.skipTrack = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Skipping track for " + userId);
                        return [4 /*yield*/, this.checkConnection(userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.spotifyApi.skipToNext()];
                    case 2:
                        _a.sent();
                        logger.debug("SpotifyHelper: track skip done");
                        return [2 /*return*/];
                }
            });
        });
    };
    SpotifyHelper.prototype.getCurrentPlaybackState = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Get current playback state for " + userId);
                        return [4 /*yield*/, this.checkConnection(userId)];
                    case 1:
                        _a.sent();
                        data = this.spotifyApi.getMyCurrentPlaybackState();
                        logger.debug("SpotifyHelper get current playback state complete");
                        return [2 /*return*/, data];
                }
            });
        });
    };
    SpotifyHelper.prototype.queueSong = function (trackUri, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var data, options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("SpotifyHelper: Queue song with trackUri: " + trackUri + " for user " + userId);
                        return [4 /*yield*/, this.checkConnection(userId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.spotifyApi.getMyCurrentPlaybackState()];
                    case 2:
                        data = _a.sent();
                        if (!data.body.is_playing) return [3 /*break*/, 4];
                        options = {
                            url: "https://api.spotify.com/v1/me/player/queue?uri=" + trackUri,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'User-Agent': 'request',
                                'Authorization': "Bearer " + this.spotifyConnection.connectionToken
                            }
                        };
                        return [4 /*yield*/, request.post(options)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        logger.debug("SpotifyHelper: Queue song complete");
                        return [2 /*return*/];
                }
            });
        });
    };
    return SpotifyHelper;
}());
exports.SpotifyHelper = SpotifyHelper;
