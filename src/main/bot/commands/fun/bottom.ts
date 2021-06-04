import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /🥺|👉👈|👉 👈|>\.<|>_<|😤|≥\.≤|:amybrat:/

@Command.register
export class Bottom extends BaseCommand {
  constructor () {
    super('', COMMAND_STRING, '')
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
