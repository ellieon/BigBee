import { BeeBot } from 'bot/bot'
import { Client } from 'discord.js'
import './web'

const bot = new BeeBot()
bot.init(new Client())
