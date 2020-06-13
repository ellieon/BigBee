import { BeeBot } from 'bot/bot'
import { Client } from 'discord.js'
import './web'
import { EnvironmentHelper } from 'common/environmentHelper'
import * as logger from 'winston'

logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console({
  silent: process.env.NODE_ENV === 'test',
  level: EnvironmentHelper.getLoggingLevel()
}))

logger.info(`Debug mode is ${EnvironmentHelper.isDevelopmentMode()}`)
logger.info(`Log level set to ${EnvironmentHelper.getLoggingLevel()}`)

const bot = new BeeBot()
bot.init(new Client())
