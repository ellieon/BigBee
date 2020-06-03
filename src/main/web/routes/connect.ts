import * as express from 'express'
import { DiscordMiddleware } from 'web/common/discordMiddleware'
import { EnvironmentHelper } from 'common/environmentHelper'
// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/connect',
    DiscordMiddleware.createHandler('index'),
    async (req, res, next) => {
      res.redirect(EnvironmentHelper.getBaseURL())
    })
