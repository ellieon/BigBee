import * as express from 'express'
import { EnvironmentHelper, EnvironmentHelper as env } from '../../common/environmentHelper'
import { DatabaseHelper } from 'common/database'
import { DiscordMiddleware } from 'web/common/discordMiddleware'
import { DiscordHelper } from 'common/discordHelper'
import * as logger from 'winston'

const scopes = [
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-modify-private',
  'playlist-read-private'
]

const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi({
  clientId: env.getSpotifyClientId(),
  clientSecret: env.getSpotifyClientSecret(),
  redirectUri: env.getSpotifyCallbackUrl()
})

const database: DatabaseHelper = new DatabaseHelper()
const spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, 'some-state')

// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/spotify-login', DiscordMiddleware.createHandler('spotify-login'), (req, res) => {
    res.redirect(spotifyAuthUrl)
  })
  .get('/callback', DiscordMiddleware.createHandler('spotify-login'), async (req, res) => {
    try {
      const data = await spotifyApi.authorizationCodeGrant(req.query.code)
      spotifyApi.setAccessToken(data.body['access_token'])
      spotifyApi.setRefreshToken(data.body['refresh_token'])
      let refreshDate: Date = new Date()
      refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)

      const userId = await DiscordHelper.getUserId(res.locals.SESSION_ID)
      await database.setCurrentSpotifyKey(userId, data.body.access_token, data.body.refresh_token, refreshDate)
        .catch(logger.error)
      res.redirect(EnvironmentHelper.getBaseURL())
    } catch (err) {
      res.send(err)
    }

  }).get('/disconnect', DiscordMiddleware.createHandler('disconnect'), async (req, res) => {
    const user = await DiscordHelper.getUser(res.locals.SESSION_ID)
    await database.deleteUser(user.id)
    res.send(`User ${user.username} has been deleted from the database`)
  })
