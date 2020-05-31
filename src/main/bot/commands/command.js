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
exports.BaseCommand = exports.Command = void 0;
var requireDirectory = require("require-directory");
var path = require("path");
var Command;
(function (Command) {
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
    Command.GetImplementations = GetImplementations;
    function register(ctor) {
        implementations.push(ctor);
        return ctor;
    }
    Command.register = register;
    function findAll(path) {
        requireDirectory(module, path, options);
    }
})(Command = exports.Command || (exports.Command = {}));
var BaseCommand = /** @class */ (function () {
    function BaseCommand(name, commandString, description) {
        this.name = name;
        this.commandString = commandString;
        this.description = description;
    }
    BaseCommand.prototype.getTrigger = function () {
        return this.commandString;
    };
    BaseCommand.prototype.setClient = function (client) {
        this.client = client;
    };
    BaseCommand.prototype.getClient = function () {
        return this.client;
    };
    BaseCommand.prototype.setBot = function (bot) {
        this.bot = bot;
    };
    BaseCommand.prototype.getBot = function () {
        return this.bot;
    };
    BaseCommand.prototype.getName = function () {
        return this.name;
    };
    BaseCommand.prototype.getDescription = function () {
        return this.description;
    };
    BaseCommand.prototype.checkReactMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message.react('✅')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BaseCommand.prototype.crossReactMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, message.react('❎')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // private static readonly PREFIX: string = EnvironmentHelper.isDevelopmentMode() ? 'dbee!' : 'bee!'
    BaseCommand.EVERYONE_PATTERN = /@(everyone|here)/;
    BaseCommand.USERS_PATTERN = /<@!?(\d{17,19})>/;
    BaseCommand.ROLES_PATTERN = /<@&(\d{17,19})>/;
    BaseCommand.CHANNELS_PATTERN = /<#(\d{17,19})>/;
    return BaseCommand;
}());
exports.BaseCommand = BaseCommand;
