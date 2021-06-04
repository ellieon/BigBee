import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /^bee!transrights$/

@Command.register
export class TransRights extends BaseCommand {
  constructor () {
    super('', COMMAND_STRING, '')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await message.channel.send('TRANS RIGHTS!!!')
    await this.checkReactMessage(message)
  }

}
