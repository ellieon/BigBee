"use strict";
exports.__esModule = true;
exports.BeeBot = void 0;
var DiscordClient = require("discord.js");
var environmentHelper_1 = require("common/environmentHelper");
var command_1 = require("bot/commands/command");
var botExtension_1 = require("bot/extensions/botExtension");
var logger = require('winston');
var BeeBot = /** @class */ (function () {
    function BeeBot() {
        this.bot = new DiscordClient.Client();
        this.registeredCommands = [];
    }
    BeeBot.prototype.init = function () {
        var _this = this;
        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console(), {
            colorize: true
        });
        logger.level = environmentHelper_1.EnvironmentHelper.getLoggingLevel();
        logger.info("Log level set to " + environmentHelper_1.EnvironmentHelper.getLoggingLevel());
        this.bot.on('ready', function () {
            logger.info('Connected');
            logger.info("Environment = " + environmentHelper_1.EnvironmentHelper.getEnvironment());
            logger.info("Debug channel = " + environmentHelper_1.EnvironmentHelper.getDebugChannelName());
            _this.bot.user.setPresence({
                activity: { name: 'Everybody knows it\'s big dick bee! ' },
                status: 'online'
            })["catch"](logger.error);
        });
        this.bot.on('message', function (message) {
            _this.handleMessage(message);
        });
        this.bot.login(environmentHelper_1.EnvironmentHelper.getDiscordBotToken()).then(logger.info('Bot login successful'));
        this.addCommands();
        this.addExtensions();
    };
    BeeBot.prototype.addCommands = function () {
        var _this = this;
        command_1.Command.GetImplementations().forEach(function (command) {
            _this.addCommand(new command());
        });
    };
    BeeBot.prototype.addExtensions = function () {
        var _this = this;
        botExtension_1.Extension.GetImplementations().forEach(function (extension) {
            _this.addExtension(new extension());
        });
    };
    BeeBot.prototype.getCommands = function () {
        return this.registeredCommands;
    };
    BeeBot.prototype.addExtension = function (extension) {
        logger.info("Initialising extension " + extension.getName());
        extension.setClient(this.bot);
        extension.init();
    };
    BeeBot.prototype.addCommand = function (command) {
        logger.info("Registered command " + command.getName());
        command.setClient(this.bot);
        command.setBot(this);
        this.registeredCommands.push(command);
    };
    BeeBot.prototype.handleMessage = function (message) {
        if (message.author.id === this.bot.user.id) {
            return;
        }
        this.registeredCommands.forEach(function (c) {
            if (message.content.toLowerCase().match(c.getTrigger())) {
                logger.info("Executing command " + c.getName());
                c.execute(message)
                    .then(function () { return logger.info("Command executed " + c.getName()); })["catch"](logger.error);
            }
        });
    };
    return BeeBot;
}());
exports.BeeBot = BeeBot;
