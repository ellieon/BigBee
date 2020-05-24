"use strict";
exports.__esModule = true;
var express = require("express");
var environmentHelper_1 = require("../../common/environmentHelper");
var database_1 = require("../../common/database");
var scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state',
    'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'];
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId: environmentHelper_1.EnvironmentHelper.getSpotifyClientId(),
    clientSecret: environmentHelper_1.EnvironmentHelper.getSpotifyClientSecret(),
    redirectUri: environmentHelper_1.EnvironmentHelper.getSpotifyCallbackUrl()
});
var database = new database_1.DatabaseHelper();
var spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, "some-state");
exports["default"] = express.Router()
    .get('/spotify-login', function (req, res) {
    res.redirect(spotifyAuthUrl);
})
    .get('/callback', function (req, res) {
    console.log(req.query.code);
    spotifyApi.authorizationCodeGrant(req.query.code)
        .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
        return data.body['access_token'];
    })
        .then(database.setCurrentSpotifyKey.bind(database))
        .then(spotifyApi.getMyCurrentPlaybackState.bind(spotifyApi))
        .then(function (data) {
        res.send("Success: " + data.body.item.name + ' ' + data.body.item.artists[0].name);
    });
}).get('/logout', function (req, res) {
    spotifyApi.resetAccessToken();
    spotifyApi.resetRefreshToken();
    res.send("Spotify disconnect successful");
});
