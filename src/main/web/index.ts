import * as express from 'express/lib/express'
import * as nunjucks from 'express-nunjucks'
import spotify from 'web/routes/spotify'
import discord from 'web/routes/discord'
import index from 'web/routes/'
import connect from 'web/routes/connect'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import * as cookieParser from 'cookie-parser'
import * as logger from 'winston'
import { EnvironmentHelper } from 'common/environmentHelper'

export const app: express.Application = express()
export let server

const port = process.env.PORT || 443
const httpPort = process.env.HTTP_PORT || 80

app.use(function (req, res, next) {
  if (!req.secure) {
    return res.redirect(['https://', req.get('Host'), req.url].join(''))
  }
  next()
})

app.use(cookieParser())
app.use(spotify)
app.use(discord)
app.use(index)
app.use(connect)

app.use(express.static(__dirname + '/resource'))
app.set('views', __dirname + '/views')

app.set('view engine', 'njk')

nunjucks(app, {
  watch: EnvironmentHelper.isDevelopmentMode(),
  noCache: EnvironmentHelper.isDevelopmentMode()
})

// This service is intended to run on HEROKU where SSL management is provided by their router, so we only create
// a HTTPS server when we are running the localhost version
if (EnvironmentHelper.isDevelopmentMode()) {
  const sslDirectory = path.join(__dirname, 'localhost-ssl')
  const key = fs.readFileSync(path.join(sslDirectory, 'server.key'))
  const cert = fs.readFileSync(path.join(sslDirectory, 'server.cert'))
  const httpServer = http.createServer(app).listen(httpPort, () => logger.info(`http is listening on ${httpPort}`))
  server = https.createServer({
    key: key,
    cert: cert
  }, this.app)
    .listen(port, () => logger.info(`Server is listening on port ${port}`))
  server.on('close', () => {
    httpServer.close()
  })
} else {
  server = http.createServer(this.app)
    .listen(port, () => logger.info(`Server is listening on port ${port}`))
  this.app.listen(port, () => logger.info(`Server is listening on port ${port}`))
}