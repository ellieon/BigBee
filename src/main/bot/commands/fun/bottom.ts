import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /🥺/
const NAME = 'super secret command'
const DESCRIPTION = 'Triggers for the majority of this server'

@Command.register
export class Bottom extends BaseCommand {
  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await message.react('🇧')
    await message.react('🇴')
    await message.react('🇹')
    await message.react(`✝`)
    await message.react(`🅾`)
    await message.react('🇲')
  }

}
