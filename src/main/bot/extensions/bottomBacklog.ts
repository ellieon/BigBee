import { Guild, TextChannel } from 'discord.js'
import { BotExtension, Extension } from 'bot/extensions/botExtension'
import * as logger from 'winston'
import { DatabaseHelper } from 'common/database'

const COMMAND_STRING = /🥺|👉👈|👉 👈|>\.<|>_<|😤|≥\.≤|:amybrat:/
/* This is a legacy script that was designed to be run once then removed, the code will be left here in case it is needed
// again, just uncomment the line below and it will run on startup */
@Extension.register
export class BottomBacklog extends BotExtension {

  public init (): void {
    this.getClient().on('ready', () => this.fillBacklog())
  }

  private async fillBacklog () {
    const guilds = this.getClient().guilds.cache.map(guild => guild)
    this.populateBacklog(guilds).then(() => logger.info('Finished filling backlog'))
  }
  private async populateBacklog (guilds: Guild[]) {
    if ((await DatabaseHelper.getInstance().isBacklogDone())) {
      logger.info('Bottom backlog already done')
      return
    }
    try {
      for (let guild of guilds) {
        const channels = guild.channels.cache.map(channel => channel)
        for (let channel of channels) {
          if (channel instanceof TextChannel) {
            logger.info(`scanning channel ${channel.name}`)
            let messages = await this.getAllMessagesForChannel(channel)
            logger.info(`found ${messages.length} messages`)
            for (let message of messages) {
              if (message.content.toLowerCase().match(COMMAND_STRING)) {
                await DatabaseHelper.getInstance().incrementScoreBoardForUser(message.author.id)
              }
            }
            logger.info(`finished scanning ${channel.name}`)
          }
        }
      }
      await DatabaseHelper.getInstance().markBacklogDone()
    } catch (e) {
      logger.error(e)
    }
  }

  private async getAllMessagesForChannel (channel) {
    const allMessages = []
    let lastId

    while (true) {
      const options = { limit: 100, before: undefined }
      if (lastId) {
        options.before = lastId
      }

      const messages = await channel.messages.fetch(options)
      allMessages.push(...messages.array())
      lastId = messages.last().id
      logger.info(`pulled ${allMessages.length} from ${channel.name}`)

      if (messages.size !== 100) {
        break
      }
    }

    return allMessages
  }

  getName (): string {
    return ''
  }

}
