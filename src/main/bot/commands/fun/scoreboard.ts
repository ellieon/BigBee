import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { DatabaseHelper } from 'common/database'
import * as logger from 'winston'
import { DiscordHelper } from 'common/discordHelper'

const COMMAND_STRING = /^bee!bottoms$/

@Command.register
export class Scoreboard extends BaseCommand {
  constructor () {
    super('bee!bottoms', COMMAND_STRING, 'Displays the top of the bottoms')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    const results = await DatabaseHelper.getInstance().getScoreboardValues()
    const bottoms = []
    for (let result of results) {
      let name = 'Unknown'
      try {
        const user: DiscordClient.User = await DiscordHelper.getInstance().getUserByUserId(result.user_id)
        if (user === undefined) {
          continue
        }
        name = user.username
        bottoms.push({ name: name, count: result.count })
      } catch {
        logger.error(`Unable to find userId: ${result.user_id}`)
      }
    }

    if (bottoms.length > 0) {
      bottoms.sort((a, b) => b.count - a.count)
      let table: string = 'Here is the current bottom leaderboard:\n```'
      for (let bottom of bottoms) {
        table += `\n ${bottom.name}: ${bottom.count}`
      }
      table += '```'
      await message.channel.send(table)
    }
  }
}
