import * as express from 'express'
import { DiscordMiddleware } from 'web/common/discordMiddleware'
import { EnvironmentHelper } from 'common/environmentHelper'
import { JwtHelper } from 'web/common/jwtHelper'
// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/connect',
    DiscordMiddleware.createHandler('index'),
    async (req, res, next) => {
      res.redirect(EnvironmentHelper.getBaseURL())
    })
  .get('/logout', async (req, res, next) => {
    JwtHelper.expireCookie(res)
    res.redirect(EnvironmentHelper.getBaseURL())
  })
