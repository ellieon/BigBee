import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { DatabaseHelper } from 'common/database'

const COMMAND_STRING = /🥺|👉👈|👉 👈|>\.<|>_<|😤|😡|😠|≥\.≤|:amybrat:|:bratrachloe:/

@Command.register
export class Bottom extends BaseCommand {
  constructor () {
    super('', COMMAND_STRING, '')
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await DatabaseHelper.getInstance().incrementScoreBoardForUser(message.author.id)
    await message.react('🇧')
    await message.react('🇴')
    await message.react('🇹')
    await message.react(`✝`)
    await message.react(`🅾`)
    await message.react('🇲')
  }

}
