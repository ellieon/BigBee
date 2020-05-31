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
exports.DatabaseHelper = exports.UserID = exports.SpotifyConnection = void 0;
var environmentHelper_1 = require("common/environmentHelper");
var logger = require("winston");
var Pool = require('pg').Pool;
var SpotifyConnection = /** @class */ (function () {
    function SpotifyConnection(connectionToken, refreshToken, expires) {
        this.connectionToken = connectionToken;
        this.refreshToken = refreshToken;
        this.expires = expires;
    }
    return SpotifyConnection;
}());
exports.SpotifyConnection = SpotifyConnection;
var UserID = /** @class */ (function () {
    function UserID() {
    }
    return UserID;
}());
exports.UserID = UserID;
var DatabaseHelper = /** @class */ (function () {
    function DatabaseHelper() {
        this.pool = new Pool({
            connectionString: environmentHelper_1.EnvironmentHelper.getDatabaseURL()
        });
    }
    DatabaseHelper.prototype.getSpotifyKeyForUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var res, row, expires;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        logger.debug("DatabaseHelper: get spotify key for " + userId);
                        return [4 /*yield*/, this.pool.query(DatabaseHelper.GET_KEY, [userId])["catch"](logger.error)];
                    case 1:
                        res = _a.sent();
                        if (res.rows.length === 0) {
                            logger.debug("DatabaseHelper: found no user");
                            return [2 /*return*/, undefined];
                        }
                        else {
                            logger.debug("DatabaseHelper: found a user");
                            row = res.rows[0];
                            expires = new Date(row.expires);
                            return [2 /*return*/, new SpotifyConnection(row.connection_token, row.refresh_token, expires)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseHelper.prototype.setCurrentSpotifyKey = function (userId, connectionToken, refreshToken, expires) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.debug("DatabaseHelper: set spotify key " + userId + ", connection_token:" + connectionToken + ", refresh_token:" + refreshToken + ", expires:" + expires);
                return [2 /*return*/, this.pool.query(DatabaseHelper.CREATE_UPDATE, [userId, connectionToken, refreshToken, expires.toISOString()])["catch"](logger.error)];
            });
        });
    };
    DatabaseHelper.prototype.updateSpotifyKeyForUser = function (userId, connectionToken, expires) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                logger.debug("DatabaseHelper: update spotify key for user, userId:" + userId + ", connection_token:" + connectionToken + ", expires:" + expires);
                return [2 /*return*/, this.pool.query('UPDATE spotify_connections SET user_id = $1, connection_token = $2, expires = $3 WHERE user_id = $1', [userId, connectionToken, expires.toISOString()])];
            });
        });
    };
    DatabaseHelper.prototype.getAllUserIds = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.query(DatabaseHelper.GET_USERS)["catch"](logger.error)];
                    case 1: return [2 /*return*/, (_a.sent()).rows];
                }
            });
        });
    };
    DatabaseHelper.prototype.deleteUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pool.query(DatabaseHelper.DELETE_USERS, [userId])["catch"](logger.error)];
            });
        });
    };
    DatabaseHelper.CREATE_UPDATE = "\n    INSERT INTO spotify_connections VALUES ($1, $2, $3, $4)\n        ON CONFLICT (user_id) DO\n        UPDATE SET connection_token = $2, refresh_token = $3, expires = $4\n   ";
    DatabaseHelper.GET_KEY = "SELECT connection_token, refresh_token, expires FROM spotify_connections WHERE user_id=$1";
    DatabaseHelper.GET_USERS = "SELECT user_id FROM spotify_connections";
    DatabaseHelper.DELETE_USERS = "DELETE from spotify_connections WHERE user_id=$1";
    return DatabaseHelper;
}());
exports.DatabaseHelper = DatabaseHelper;
