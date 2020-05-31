import * as express from 'express'
import { EnvironmentHelper as env } from 'common/environmentHelper'
import { JwtHelper } from 'web/common/jwtHelper'
import * as logger from 'winston'

const DiscordOauth2 = require('discord-oauth2')

const oauth = new DiscordOauth2({
  clientId: env.getDiscordClientId(),
  clientSecret: env.getDiscordClientSecret(),
  redirectUri: env.getDiscordCallbackUrl()
})

// tslint:disable-next-line:no-default-export
export default express.Router()
  .get('/login', (req, res: express.Request) => {
    const discordAuthUrl = oauth.generateAuthUrl({
      scope: 'identify',
      state: `${req.query.callback}`
    })
    res.redirect(`${discordAuthUrl}`)
  })
  .get('/discord-callback', async (req, res) => {
    try {
      const data = await oauth.tokenRequest({
        code: req.query.code,
        grantType: 'authorization_code'
      })

      const token: any = JwtHelper.createBearerToken(data.access_token)
      JwtHelper.saveBearerTokenToCookie(res, token)
      res.redirect(`${env.getBaseURL()}/${req.query.state}`)
    } catch (err) {
      logger.error(err)
      res.send(err)
    }

  })
