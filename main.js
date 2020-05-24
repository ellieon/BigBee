var Discord = require('discord.js');
var DiscordOauth2 = require('discord-oauth2')
var logger = require('winston');
var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express()
const oauth = new DiscordOauth2({
    clientId: process.env.BEE_DISCORD_CLIENT_ID,
    clientSecret: process.env.BEE_DISCORD_CLIENT_SECRET,
    redirectUri: `${process.env.BEE_URL}/discord-callback`
})

const debug = process.env.BEE_DEBUG || false
const debugChannel = process.env.BEE_DEBUG_CHANNEL
const port = process.env.PORT || 3000

const scopes =
    ['user-read-private',
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-recently-played',
    ]

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.BEE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.BEE_SPOTIFY_CLIENT_SECRET,
    redirectUri: `${process.env.BEE_URL}/callback`
});

const authoriseURL = spotifyApi.createAuthorizeURL(scopes, "some-state");
const discordAuthoriseURL = oauth.generateAuthUrl({
    scope: ["identify"],
    state: "some-state"
});

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

const bot = new Discord.Client();
bot.on('ready', function (evt) {
    logger.info('Connected');
});


function isOnDebugChannel(message) {
    return debug && message.channel.name === debugChannel
}

function notOnDebug(message) {
    logger.info(debug)
    logger.info(debugChannel)
    logger.info(message.channel.name)
    return !debug && message.channel.name !== debugChannel
}

bot.on('message', message => {
    if ( notOnDebug(message) ) { //These are commands that only run in production mode
        if (message.content.toLowerCase().includes('big dick bee')) {
            message.channel.send('BIG');
            message.channel.send('DICK');
            message.channel.send('BEE');
        }

        if (message.content.startsWith('bee!')) {
            switch (message.content.toLowerCase().substring(4, message.content.length)) {
                case "skip":
                    skipSongAndOutput(message)
                    break
            }
        }
    } else if (isOnDebugChannel(message)) {

    }

});
bot.login(process.env.BEE_DISCORD_BOT_TOKEN);

function skipSongAndOutput(message) {
    spotifyApi.skipToNext().then(
        function () {
            return spotifyApi.getMyCurrentPlaybackState()
        }).then(
        function (data) {
            message.channel.send(`I have skipped the song, the now playing song is: ${data.body.item.name} by ${data.body.item.artists[0].name}`)
        }, function (err) {
            message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
        }
    )
}

app.get('/', (req, res) => res.send("There is something running here I promise :)"));
app.get('/login', (req, res) => res.redirect(authoriseURL))
app.get('/discord-callback', (req, res) => {
    oauth.tokenRequest({
        code: req.query.code,
        grantType: "authorization_code"
    })
        .then((data) => oauth.getUser(data.access_token))
        .then((data) => res.send(`${data.id}:${data.username}#${data.discriminator}`))
})


//res.redirect(`${process.env.BEE_URL}/login-spotify`)

app.get('/login-spotify', (req, res) => res.redirect(authoriseURL))
app.get('/logout', (req, res) => {
    spotifyApi.resetAccessToken();
    spotifyApi.resetRefreshToken();
    res.send("Spotify disconnect successful");
})
app.get('/callback', (req, res) => {
    spotifyApi.authorizationCodeGrant(req.query.code).then(
        function (data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        function (err) {
            console.log('Something went wrong!', err);
        }
    ).then(
        function (data) {
            return spotifyApi.getMyCurrentPlaybackState()
        }
    ).then(
        function (data) {
            res.send("Success: " + data.body.item.name + ' ' + data.body.item.artists[0].name);
        }
    )
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))

