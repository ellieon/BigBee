import { Guild, TextChannel } from 'discord.js'
import { BotExtension, Extension } from 'bot/extensions/botExtension'
import * as logger from 'winston'
import { DatabaseHelper } from 'common/database'

const COMMAND_STRING = /🥺|👉👈|👉 👈|>\.<|>_<|😤|≥\.≤|:amybrat:|:bratrachloe:/

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
            let messages = await this.lots_of_messages_getter(channel)
            for (let message of messages) {
              if (message.content.toLowerCase().match(COMMAND_STRING)) {
                await DatabaseHelper.getInstance().incrementScoreBoardForUser(message.author.id)
              }
            }
          }
        }
      }
      await DatabaseHelper.getInstance().markBacklogDone()
    } catch (e) {
      logger.error(e)
    }
  }

  private async lots_of_messages_getter (channel, limit = 5000) {
    let allMessages: any[] = []
    let last

    while (true) {
      const options = { limit: 100, before: undefined }
      if (last) {
        options.before = last
      }

      const messages = await channel.messages.fetch(options)
      allMessages.push(...messages.array())
      last = messages.last().id

      if (messages.size !== 100 || allMessages.length >= limit) {
        break
      }
    }

    return allMessages
  }

  getName (): string {
    return ''
  }

}
