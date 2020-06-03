import * as express from 'express'
import { EnvironmentHelper, EnvironmentHelper as env } from '../../common/environmentHelper'
import { SpotifyConnection } from 'common/database'
import { DiscordMiddleware } from 'web/common/discordMiddleware'
import { DiscordHelper } from 'common/discordHelper'
import { SpotifyHelper } from 'common/spotifyHelper'

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

const spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, 'some-state')

// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/spotify-login', DiscordMiddleware.createHandler('spotify-login'), (req, res) => {
    res.redirect(spotifyAuthUrl)
  })
  .get('/callback', DiscordMiddleware.createHandler('spotify-login'), async (req, res) => {
    try {
      const data = await spotifyApi.authorizationCodeGrant(req.query.code)
      let refreshDate: Date = new Date()
      refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)
      const userId = await DiscordHelper.getUserId(res.locals.SESSION_ID)

      const spotifyConnection = new SpotifyConnection(userId, data.body.access_token, data.body.refresh_token, refreshDate)

      await SpotifyHelper.getInstance().saveConnection(spotifyConnection)

      res.redirect(EnvironmentHelper.getBaseURL())
    } catch (err) {
      res.send(err)
    }

  }).get('/disconnect', DiscordMiddleware.createHandler('disconnect'), async (req, res) => {
    const user = await DiscordHelper.getUser(res.locals.SESSION_ID)
    await SpotifyHelper.getInstance().deleteConnectionForUser(user.id)
    res.redirect(EnvironmentHelper.getBaseURL())
  })
