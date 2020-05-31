"use strict";
exports.__esModule = true;
exports.EnvironmentHelper = void 0;
var EnvironmentHelper = /** @class */ (function () {
    function EnvironmentHelper() {
    }
    EnvironmentHelper.getBaseURL = function () {
        return process.env.BEE_URL;
    };
    EnvironmentHelper.getEnvironment = function () {
        return process.env.BEE_ENV || 'debug';
    };
    EnvironmentHelper.isDevelopmentMode = function () {
        return this.getEnvironment() === 'debug';
    };
    EnvironmentHelper.getDebugChannelName = function () {
        return process.env.BEE_DEBUG_CHANNEL;
    };
    EnvironmentHelper.getSpotifyClientId = function () {
        return process.env.BEE_SPOTIFY_CLIENT_ID;
    };
    EnvironmentHelper.getSpotifyClientSecret = function () {
        return process.env.BEE_SPOTIFY_CLIENT_SECRET;
    };
    EnvironmentHelper.getSpotifyCallbackUrl = function () {
        return this.getBaseURL() + "/callback";
    };
    EnvironmentHelper.getDiscordClientId = function () {
        return process.env.BEE_DISCORD_CLIENT_ID;
    };
    EnvironmentHelper.getDiscordClientSecret = function () {
        return process.env.BEE_DISCORD_CLIENT_SECRET;
    };
    EnvironmentHelper.getDiscordBotToken = function () {
        return process.env.BEE_DISCORD_BOT_TOKEN;
    };
    EnvironmentHelper.getDiscordCallbackUrl = function () {
        return this.getBaseURL() + "/discord-callback";
    };
    EnvironmentHelper.getDatabaseURL = function () {
        return process.env.DATABASE_URL;
    };
    EnvironmentHelper.getGreeterChannel = function () {
        return process.env.BEE_GREETER_CHANNEL;
    };
    EnvironmentHelper.getLoggingLevel = function () {
        if (this.isDevelopmentMode()) {
            return process.env.BEE_LOGGING_LEVEL || 'debug';
        }
        else {
            return process.env.BEE_LOGGING_LEVEL || 'info';
        }
    };
    return EnvironmentHelper;
}());
exports.EnvironmentHelper = EnvironmentHelper;
