import * as express from 'express'
import { EnvironmentHelper } from 'common/environmentHelper'
import { JwtHelper } from 'web/common/jwtHelper'
import { DatabaseHelper, SpotifyConnection } from 'common/database'
import { DiscordHelper } from 'common/discordHelper'
import { User } from 'discord.js'
// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/index', indexRoute)
  .get('/', indexRoute)

async function indexRoute (req, res, next) {
  const token = JwtHelper.readBearerTokenFromRequest(req)
  let spotifyConnection: SpotifyConnection = undefined
  let user: User = undefined
  let username: string = undefined
  if (token) {
    const userId: string = await DiscordHelper.getUserId(token)
    user = await DiscordHelper.getUser(token)
    username = user.username
    spotifyConnection = await new DatabaseHelper().getSpotifyKeyForUser(userId)

  }

  res.render('index.html', {
    baseUrl: EnvironmentHelper.getBaseURL(),
    discordConnected: token !== undefined,
    spotifyConnected: spotifyConnection !== undefined,
    username: username
  })
}
