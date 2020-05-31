import { WebService } from './web'
import { BeeBot } from 'bot/bot'
import { Client } from 'discord.js'

const web = new WebService()
web.init()
const bot = new BeeBot()
bot.init(new Client())
