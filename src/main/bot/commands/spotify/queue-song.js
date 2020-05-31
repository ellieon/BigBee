"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.QueueSong = void 0;
var command_1 = require("bot/commands/command");
var spotifyHelper_1 = require("common/spotifyHelper");
var database_1 = require("common/database");
var logger = require("winston");
var NAME = 'bee!queue [user] <song_name>';
var DESCRIPTION = 'Searches for and adds it to a play queue';
var COMMAND_STRING = /^bee!queue(?:\s<@!(?<userId>\d{17,19})>?)?(?:\s(?<songName>.+))?$/;
var QueueSong = /** @class */ (function (_super) {
    __extends(QueueSong, _super);
    function QueueSong() {
        var _this = _super.call(this, NAME, COMMAND_STRING, DESCRIPTION) || this;
        _this.helper = spotifyHelper_1.SpotifyHelper.getInstance();
        _this.db = new database_1.DatabaseHelper();
        return _this;
    }
    QueueSong.prototype.execute = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findAndPlay(message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    QueueSong.prototype.findAndPlay = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var matches, songName, users, name, artist, uri, i, userId, trackData, tracks, successMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        matches = message.content.match(COMMAND_STRING);
                        songName = matches.groups.songName;
                        if (!matches || !songName || songName.length === 0) {
                            message.channel.send('I need a song name to search `bee!queue [search_term]`')["catch"](logger.error);
                            return [2 /*return*/];
                        }
                        if (!matches.groups.userId) return [3 /*break*/, 1];
                        users = [{ user_id: matches.groups.userId }];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.db.getAllUserIds()];
                    case 2:
                        users = _a.sent();
                        _a.label = 3;
                    case 3:
                        name = undefined;
                        uri = undefined;
                        if (users.length === 0) {
                            message.channel.send('There are currently no registered spotify users')["catch"](logger.error);
                        }
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < users.length)) return [3 /*break*/, 9];
                        userId = users[i].user_id;
                        if (!!uri) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.helper.searchForTrack(songName, userId)];
                    case 5:
                        trackData = _a.sent();
                        if (!trackData) {
                            message.channel.send('I was unable to connect to spotify to search for tracks')["catch"](logger.error);
                            this.crossReactMessage(message);
                            return [2 /*return*/];
                        }
                        tracks = trackData.body.tracks.items;
                        if (tracks.length === 0) {
                            message.channel.send('I was unable to find any tracks by the name' + songName)["catch"](logger.error);
                            this.crossReactMessage(message);
                            return [2 /*return*/];
                        }
                        name = tracks[0].name;
                        artist = tracks[0].artists[0].name;
                        uri = tracks[0].uri;
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.helper.queueSong(uri, userId)["catch"](logger.error)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 4];
                    case 9:
                        successMessage = "Added the song `" + name + " by " + artist + "` to";
                        if (users.length === 1) {
                            message.channel.send(successMessage + " <@!" + users[0].user_id + ">'s queue")["catch"](logger.error);
                        }
                        else {
                            message.channel.send(successMessage + "  all users queue")["catch"](logger.error);
                        }
                        this.checkReactMessage(message);
                        return [2 /*return*/];
                }
            });
        });
    };
    QueueSong = __decorate([
        command_1.Command.register
    ], QueueSong);
    return QueueSong;
}(command_1.BaseCommand));
exports.QueueSong = QueueSong;
