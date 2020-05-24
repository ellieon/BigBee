import * as express from 'express'
import {EnvironmentHelper as env} from "../../common/environmentHelper";
import {DatabaseHelper} from "../../common/database";

const scopes = ['user-read-private', 'user-read-email', 'user-read-playback-state',
    'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played']
const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
    clientId: env.getSpotifyClientId(),
    clientSecret: env.getSpotifyClientSecret(),
    redirectUri: env.getSpotifyCallbackUrl()
});


const database: DatabaseHelper = new DatabaseHelper();
const spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, "some-state");

function errLogger(err) {
    console.log('Something went wrong!', err)
}

export default express.Router()
    .get('/spotify-login', (req, res) => {
        res.redirect(spotifyAuthUrl)
    })
    .get('/callback', (req, res) => {
        console.log(req.query.code)
        spotifyApi.authorizationCodeGrant(req.query.code)
            .then(function (data) {
                    spotifyApi.setAccessToken(data.body['access_token']);
                    spotifyApi.setRefreshToken(data.body['refresh_token']);
                    return data.body['access_token']
                })
            .then(database.setCurrentSpotifyKey.bind(database))
            .then(spotifyApi.getMyCurrentPlaybackState.bind(spotifyApi))
            .then((data) => {
                 res.send("Success: " + data.body.item.name + ' ' + data.body.item.artists[0].name);
             })
    }).get('/logout', (req, res) => {
        spotifyApi.resetAccessToken();
        spotifyApi.resetRefreshToken();
        res.send("Spotify disconnect successful");
    })
