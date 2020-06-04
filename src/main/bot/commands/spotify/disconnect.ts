import * as DiscordClient from 'discord.js'
import { Command, BaseCommand } from 'bot/commands/command'

import * as logger from 'winston'
import { SpotifyHelper } from 'common/spotifyHelper'
import { SpotifyConnection } from 'common/database'

const COMMAND_STRING = /^bee!disconnect$/
const NAME = 'bee!disconnect'
const DESCRIPTION = 'Disconnects the user from Spotify'

@Command.register
export class Disconnect extends BaseCommand {

  private readonly spotifyHelper: SpotifyHelper = SpotifyHelper.getInstance()

  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    const connection: SpotifyConnection = this.spotifyHelper.getConnectionForUser(message.author.id)
    if (!connection) {
      message.channel.send(`<@!${message.author.id}> is not currently connected`).catch(logger.error)
      await this.checkReactMessage(message)
      return
    }
    await this.spotifyHelper.deleteConnectionForUser(message.author.id)
      .catch(() => {
        this.crossReactMessage(message)
        message.channel.send(`I was unable to disconnect  <@!${message.author.id}>`)
      })
    message.channel.send(`I have disconnected <@!${message.author.id}> from Spotify playback`).catch(logger.error)
    await this.checkReactMessage(message)
  }
}
