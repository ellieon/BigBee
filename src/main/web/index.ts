import * as express from 'express/lib/express'
import * as nunjucks from 'express-nunjucks'
import spotify from 'web/routes/spotify'
import discord from 'web/routes/discord'
import index from 'web/routes/'
import connect from 'web/routes/connect'
import * as cookieParser from 'cookie-parser'
import * as logger from 'winston'
import { EnvironmentHelper } from 'common/environmentHelper'

export class WebService {

  readonly port = process.env.PORT || 3000
  readonly app: express.Application = express()

  init () {
    this.app.use(cookieParser())
    this.app.use(spotify)
    this.app.use(discord)
    this.app.use(index)
    this.app.use(connect)

    this.app.use(express.static(__dirname + '/resource'))
    this.app.set('views', __dirname + '/views')

    this.app.set('view engine', 'njk')

    nunjucks(this.app, {
      watch: EnvironmentHelper.isDevelopmentMode(),
      noCache: EnvironmentHelper.isDevelopmentMode()
    })

    this.app.listen(this.port, () => logger.info(`Server is listening on port ${this.port}`))
  }
}
