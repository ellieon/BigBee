"use strict";
exports.__esModule = true;
var express = require("express");
var environmentHelper_1 = require("./../../common/environmentHelper");
var DiscordOauth2 = require('discord-oauth2');
var oauth = new DiscordOauth2({
    clientId: environmentHelper_1.EnvironmentHelper.getDiscordClientId(),
    clientSecret: environmentHelper_1.EnvironmentHelper.getDiscordClientSecret(),
    redirectUri: environmentHelper_1.EnvironmentHelper.getDiscordCallbackUrl()
});
var discordAuthUrl = oauth.generateAuthUrl({
    scope: ["identify"],
    state: "some-state"
});
exports["default"] = express.Router()
    .get('/login', function (req, res) {
    res.redirect(discordAuthUrl);
})
    .get('/discord-callback', function (req, res) {
    console.log(req.query.code);
    oauth.tokenRequest({
        code: req.query.code,
        grantType: "authorization_code"
    })
        .then(function (data) { return oauth.getUser(data.access_token); })
        .then(function (data) { return res.send(data.id + ":" + data.username + "#" + data.discriminator); });
});
