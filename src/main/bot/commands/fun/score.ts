import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { DatabaseHelper } from 'common/database'

const COMMAND_STRING = /^bee!bottom\s?(<@!?(?<userId>\d{17,19})>)?\s*$/

@Command.register
export class Score extends BaseCommand {
  constructor () {
    super('bee!bottom <user>', COMMAND_STRING, 'Reveals the number of times a single user has been a bottom')
  }

  async execute (message: DiscordClient.Message, content: string): Promise<void> {

    const matches = this.getMatches(message)

    if (matches.groups.userId) {
      const count: number = await DatabaseHelper.getInstance().getScoreForUser(matches.groups.userId)
      message.channel.send(`<@!${matches.groups.userId}> has been a bottom ${count} times!`)
      await this.checkReactMessage(message)
    } else {
      await message.channel.send(`Please tag a user, (bee!bottom @user)`)
      await this.crossReactMessage(message)
    }
  }
}
