"use strict";
exports.__esModule = true;
exports.BeeBot = void 0;
var discord_1 = require("@typeit/discord");
var environmentHelper_1 = require("../common/environmentHelper");
var database_1 = require("../common/database");
var SpotifyWebApi = require('spotify-web-api-node');
var logger = require('winston');
var BeeBot = /** @class */ (function () {
    function BeeBot() {
        this.bot = new discord_1.Client();
        this.db = new database_1.DatabaseHelper();
        this.spotifyApi = new SpotifyWebApi({
            clientId: environmentHelper_1.EnvironmentHelper.getSpotifyClientId(),
            clientSecret: environmentHelper_1.EnvironmentHelper.getSpotifyClientSecret()
        });
    }
    BeeBot.prototype.isOnDebugChannel = function (message) {
        return environmentHelper_1.EnvironmentHelper.isDevelopmentMode() && message.channel.name === environmentHelper_1.EnvironmentHelper.getDebugChannelName();
    };
    BeeBot.prototype.notOnDebug = function (message) {
        return !environmentHelper_1.EnvironmentHelper.isDevelopmentMode() && message.channel.name !== environmentHelper_1.EnvironmentHelper.getDebugChannelName();
    };
    BeeBot.prototype.init = function () {
        var _this = this;
        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console, {
            colorize: true
        });
        logger.level = 'debug';
        this.bot.on('ready', function () {
            logger.info('Connected');
            logger.info("Environment = " + environmentHelper_1.EnvironmentHelper.getEnvironment());
            logger.info("Debug channel = " + environmentHelper_1.EnvironmentHelper.getDebugChannelName());
        });
        this.bot.on('message', function (message) {
            if (_this.notOnDebug(message)) { //These are commands that only run in production mode
                logger.info('Production command');
                if (message.content.toLowerCase().includes('big dick bee')) {
                    message.channel.send('BIG');
                    message.channel.send('DICK');
                    message.channel.send('BEE');
                }
                if (message.content.startsWith('bee!')) {
                    switch (message.content.toLowerCase().substring(4, message.content.length)) {
                        case "skip":
                            _this.skipSongAndOutput(message);
                            break;
                    }
                }
            }
            else if (_this.isOnDebugChannel(message)) {
                logger.info('Debug command');
                if (message.content.toLowerCase().includes('big dick bee')) {
                    message.channel.send('BIG');
                    message.channel.send('DICK');
                    message.channel.send('BEE');
                }
                if (message.content.startsWith('bee!')) {
                    switch (message.content.toLowerCase().substring(4, message.content.length)) {
                        case "skip":
                            _this.skipSongAndOutput(message);
                            break;
                    }
                }
            }
        });
        this.bot.login(environmentHelper_1.EnvironmentHelper.getDiscordBotToken());
    };
    BeeBot.prototype.skipSongAndOutput = function (message) {
        var _this = this;
        this.db.getCurrentSpotifyKey()
            .then(function (code) {
            _this.spotifyApi.setAccessToken(code);
        })
            .then(function () {
            _this.spotifyApi.skipToNext();
        })
            .then(function () { return _this.sleep(1000); })
            .then(function () {
            return _this.spotifyApi.getMyCurrentPlaybackState();
        })
            .then(function (data) {
            message.channel.send("I have skipped the song, the now playing song is: " + data.body.item.name + " by " + data.body.item.artists[0].name);
        }, function (err) {
            message.channel.send("I was unable to skip the song, I might not have an authorisation code for Spotify");
            console.log(err);
        });
    };
    BeeBot.prototype.sleep = function (ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    };
    return BeeBot;
}());
exports.BeeBot = BeeBot;
