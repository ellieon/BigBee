"use strict";
exports.__esModule = true;
var web_1 = require("./web");
var bot_1 = require("./bot/bot");
var web = new web_1.WebService();
web.init();
var bot = new bot_1.BeeBot();
bot.init();
