import * as DiscordClient from 'discord.js'
import { Command, BaseCommand } from '../command'
import * as logger from 'winston'
import { EnvironmentHelper } from 'common/environmentHelper'

const COMMAND_STRING = /^bee!connect$/
const NAME = 'bee!connect'
const DESCRIPTION = 'Shows instructions to connect to spotify'

@Command.register
export class Connect extends BaseCommand {

  private static readonly OUTPUT_MESSAGE: string =
    `Visit ${EnvironmentHelper.getBaseURL()} to connect your Spotify, connecting will allow Big Dick Bee to do the following with your account:
\`\`\`
- Read your user ID (this is an anonymous identifier)
- Add songs to your queue (When people run the bee!queue command)
- Create private playlists (Used to create "The Beelist" playlist when people run bee!queue)
- Read your private playlists (Used to find "The Beelist" to add songs to it)
\`\`\`
Once connected, you can disconnect from the same website, or run bee!disconnect`

  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message, content: string): Promise<void> {
    message.channel.send(Connect.OUTPUT_MESSAGE).catch(logger.error)
    await this.checkReactMessage(message)
  }
}
