import { JwtHelper } from 'web/common/jwtHelper'
import { EnvironmentHelper } from 'common/environmentHelper'
import * as logger from 'winston'

export class DiscordMiddleware {
  static createHandler (callback: string) {
    return function (req, res, next) {
      const token = JwtHelper.readBearerTokenFromRequest(req)
      if (!token) {
        logger.info('No token found, redirect to login')
        res.redirect(`${EnvironmentHelper.getBaseURL()}/login?callback=${callback}`)
      } else {
        res.locals.SESSION_ID = token
        next()
      }
    }
  }
}
