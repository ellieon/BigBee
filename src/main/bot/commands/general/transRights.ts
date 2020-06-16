import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /^bee!transRights$/
const NAME = 'Trans Rights'
const DESCRIPTION = 'TRANS RIGHTS!'

@Command.register
export class TransRights extends BaseCommand {
  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await message.channel.send('TRANS RIGHTS!!!')
    await this.checkReactMessage(message)
  }

}
