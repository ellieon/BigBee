import * as express from 'express/lib/express'
import spotify from 'web/routes/spotify'
import discord from 'web/routes/discord'
import index from 'web/routes/'
import * as cookieParser from 'cookie-parser'
import * as logger from 'winston'

export class WebService {

  readonly port = process.env.PORT || 3000
  readonly app: express.Application = express()

  init () {
    this.app.use(cookieParser())
    this.app.use(spotify)
    this.app.use(discord)
    this.app.use(index)

    this.app.listen(this.port, () => logger.info(`Server is listening on port ${this.port}`))
  }
}
