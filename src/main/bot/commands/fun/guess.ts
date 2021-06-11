import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /^guess what/

@Command.register
export class Guess extends BaseCommand {
  constructor () {
    super('',COMMAND_STRING,'')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await message.channel.send('What?')
    await this.checkReactMessage(message)
  }

}
