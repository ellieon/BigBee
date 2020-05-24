var Discord = require('discord.js');
var logger = require('winston');
var SpotifyWebApi = require('spotify-web-api-node')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const scopes =
['user-read-private',
  'user-read-email',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
]

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.BEE_SPOTIFY_CLIENT_ID,
    clientSecret: process.env.BEE_SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.BEE_SPOTIFY_CLIENT_URI
})

var authoriseURL = spotifyApi.createAuthorizeURL(scopes, "some-state");

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

var bot = new Discord.Client()
bot.on('ready', function (evt) {
    logger.info('Connected');
});

bot.on('message', message => {
    logger.info(message.channel.name)

    if(message.content.toLowerCase().includes('big dick bee')) {
      message.channel.send('BIG');
      message.channel.send('DICK');
      message.channel.send('BEE');
    }

    if(message.content.startsWith('bee!')) {
      switch(message.content.toLowerCase().substring(4,message.content.length)) {
        case "skip":
          skipSongAndOutput(message)
          break
      }
    }

    if(message && message.channel.name === 'gods-domain'){
      //these are debug commands

      
    }
});
bot.login(process.env.BEE_DISCORD_BOT_TOKEN);

function skipSongAndOutput(message) {
  spotifyApi.skipToNext().then(
    function() {
      return spotifyApi.getMyCurrentPlaybackState()
    }).then(
      function(data) {
        message.channel.send(`I have skipped the song, the now playing song is: ${data.body.item.name} by ${data.body.item.artists[0].name}`)
      }, function(err) {
        message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
      }
    )
}

app.get('/', (req, res) => res.send("There is something running here I promise :)"));
app.get('/login', (req, res) => res.redirect(authoriseURL))
app.get('/logout', (req, res) => {
  spotifyApi.resetAccessToken();
  spotifyApi.resetRefreshToken();
  res.send("Spotify disconnect successful");
})
app.get('/callback', (req, res) => {
    spotifyApi.authorizationCodeGrant(req.query.code).then(
        function(data) {
          spotifyApi.setAccessToken(data.body['access_token']);
          spotifyApi.setRefreshToken(data.body['refresh_token']);
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      ).then( 
        function(data) {
          return spotifyApi.getMyCurrentPlaybackState()
        }
      ).then(
        function(data) {
          res.send("Success: " + data.body.item.name + ' ' + data.body.item.artists[0].name);
        }
      )
})

app.listen(port, () => console.log(`Server is listening on port ${port}`))

