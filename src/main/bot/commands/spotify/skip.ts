import * as DiscordClient from 'discord.js'
import { BaseCommand } from '../command'
import { SpotifyConnection } from 'common/database'
import { SpotifyHelper } from 'common/spotifyHelper'
import * as logger from 'winston'

const COMMAND_STRING = /^bee!skip$/
const NAME = 'skip'
const DESCRIPTION = 'Skips to the next song in spotify'

export class Skip extends BaseCommand {

  readonly helper: SpotifyHelper = SpotifyHelper.getInstance()

  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message): Promise<void> {
    await this.skipSongAndOutput(message)
  }

  async skipSongAndOutput (message: DiscordClient.Message) {
    try {
      const rows: SpotifyConnection[] = this.helper.getAllConnections()

      if (rows.length === 0) {
        message.channel.send('There are no connected Spotify users').catch(logger.error)
        return
      }

      for (let i = 0; i < rows.length; i++) {
        const userId = rows[i].userId
        await this.helper.getCurrentPlaybackState(userId)
        await this.helper.skipTrack(userId).catch(logger.error)
      }

      message.channel.send('Song has been skipped for all users').catch(logger.error)

    } catch (err) {
      message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
        .then(logger.error)
      logger.error(err)
    }
  }
}
