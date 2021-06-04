import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /(?:big dick bee)/

@Command.register
export class Echo extends BaseCommand {
  constructor () {
    super('',COMMAND_STRING,'')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await message.channel.send('BIG')
    await message.channel.send('DICK')
    await message.channel.send('BEE')
    await this.checkReactMessage(message)
  }

}
