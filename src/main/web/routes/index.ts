import * as express from 'express'
import { DiscordMiddleware } from 'web/common/discordMiddleware'
import { SpotifyMiddleware } from 'web/common/SpotifyMiddleware'
import { EnvironmentHelper } from 'common/environmentHelper'
// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/',
    DiscordMiddleware.createHandler('spotify-login'),
    SpotifyMiddleware.requestHandler,
    async (req, res, next) => {
      res.send(`Spotify is connected, disconnect <a href="${EnvironmentHelper.getBaseURL()}/disconnect">here</a>`)
    })
