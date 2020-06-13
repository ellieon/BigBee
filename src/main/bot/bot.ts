import * as DiscordClient from 'discord.js'
import { EnvironmentHelper as env } from 'common/environmentHelper'
import { BaseCommand, Command } from 'bot/commands/command'
import { BotExtension, Extension } from 'bot/extensions/botExtension'

const logger = require('winston')

export class BeeBot {
  private bot: DiscordClient.Client
  private registeredCommands: BaseCommand[] = []

  async init (client: DiscordClient.Client) {
    this.bot = client

    this.bot.on('ready', () => {
      logger.info('Connected')
      logger.info(`Environment = ${env.getEnvironment()}`)
      logger.info(`Debug channel = ${env.getDebugChannelName()}`)
      this.bot.user.setPresence({
        activity: { name: 'BLACK LIVES MATTER!! ' },
        status: 'online'
      }).catch(logger.error)
    })

    this.bot.on('message', (message) => {
      this.handleMessage(message)
    })

    await this.bot.login(env.getDiscordBotToken())

    this.addCommands()
    this.addExtensions()
  }

  addCommands (): void {
    Command.GetImplementations().forEach((command) => {
      this.addCommand(new command())
    })
  }

  addExtensions (): void {
    Extension.GetImplementations().forEach((extension) => {
      this.addExtension(new extension())
    })
  }

  getCommands (): BaseCommand[] {
    return this.registeredCommands
  }

  getClient (): DiscordClient.Client {
    return this.bot
  }

  addExtension (extension: BotExtension) {
    logger.info(`Initialising extension ${extension.getName()}`)
    extension.setClient(this.bot)
    extension.init()
  }

  addCommand (command: BaseCommand): void {
    logger.info(`Registered command ${command.getName()}`)
    command.setClient(this.bot)
    command.setBot(this)
    this.registeredCommands.push(command)
  }

  handleMessage (message: DiscordClient.Message): void {
    if (message.author.id === this.bot.user.id) {
      return
    }

    this.registeredCommands.forEach((c) => {
      if (c.checkTrigger(message)) {
        logger.info(`Executing command ${c.getName()}`)
        c.execute(message, message.content.toLowerCase())
          .then(() => logger.info(`Command executed ${c.getName()}`))
          .catch(logger.error)
      }
    })
  }
}
