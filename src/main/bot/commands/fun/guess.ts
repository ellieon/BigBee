import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /.+/
const GOOD_GUESS = /^good guess$/
const GUESS_WHAT = /^guess what/

@Command.register
export class Guess extends BaseCommand {

  private lastUser: string
  constructor () {
    super('',COMMAND_STRING,'')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    if (this.lastUser && message.author.id === this.lastUser) {
      this.lastUser = undefined
      if (message.content.toLowerCase().match(GOOD_GUESS)) {
        await message.channel.send('🤯')
      } else {
        await message.react('😡')
      }
    } else if (message.content.toLowerCase().match(GUESS_WHAT)) {
      this.lastUser = message.author.id
      await message.channel.send('What?')
      await this.checkReactMessage(message)
    }

  }

}
