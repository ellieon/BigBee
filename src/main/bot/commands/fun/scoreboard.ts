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
    let longestLength = 0
    for (let result of results) {
      let name = 'Unknown'
      try {
        const user: DiscordClient.User = await DiscordHelper.getInstance().getUserByUserId(result.user_id)
        if (user === undefined) {
          continue
        }
        name = user.username
        longestLength = Math.max(longestLength, name.length)
        bottoms.push({ name: name, count: result.count })
      } catch {
        logger.error(`Unable to find userId: ${result.user_id}`)
      }
    }

    if (bottoms.length > 0) {
      bottoms.sort((a, b) => b.count - a.count)
      let table: string = 'Here is the current leaderboard:\n```\n'
      table += `+---+${'-'.repeat(longestLength)}+-----+`
      let place = 1
      for (let bottom of bottoms) {
        table += `\n|${place.toString().padStart(3)}|${bottom.name}${' '.repeat(longestLength - bottom.name.length)}|${bottom.count.toString().padStart(5)}|`
        if (place < bottoms.length) {
          table += `\n|---+${'-'.repeat(longestLength)}+-----|`
        }
        place++
      }
      table += `\n+---+${'-'.repeat(longestLength)}+-----+`
      table += '```'
      table += `Congratulations ${bottoms[0].name} you are the top of the bottoms 🍑👑`
      await message.channel.send(table)
    }
  }
}
