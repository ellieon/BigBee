import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'

const COMMAND_STRING = /^bee!help$/
const NAME = 'bee!help'
const DESCRIPTION = 'Displays this help text'

@Command.register
export class Help extends BaseCommand {
  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    let helpText = `I am <@${this.getClient().user.id}>, obviously the best Discord bot ever created, The following commands are available: \`\`\``
    for (const command of this.getBot().getCommands()) {
      helpText += `\n`
      helpText += `${command.getName()} | ${command.getDescription()}`
    }

    helpText += '```'

    await message.channel.send(helpText)
    await this.checkReactMessage(message)
  }

}
