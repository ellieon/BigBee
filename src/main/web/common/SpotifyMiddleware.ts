import * as express from 'express'
import { EnvironmentHelper } from 'common/environmentHelper'
import { SpotifyConnection } from 'common/database'
import { DiscordHelper } from 'common/discordHelper'
import * as logger from 'winston'
import { SpotifyHelper } from 'common/spotifyHelper'

export class SpotifyMiddleware {
  static async requestHandler (req: express.Request, res: express.Response, next: express.NextFunction) {

    const userId = await DiscordHelper.getUserId(res.locals.SESSION_ID)
    const connection: SpotifyConnection = SpotifyHelper.getInstance().getConnectionForUser(userId)
    if (!connection) {
      logger.info('No spotify token found')
      res.redirect(`${EnvironmentHelper.getBaseURL()}/spotify-login`)
    }
    next()
  }
}
