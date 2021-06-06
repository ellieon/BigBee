import * as DiscordClient from 'discord.js'
import { BaseCommand, Command } from 'bot/commands/command'
import { SpotifyHelper } from 'common/spotifyHelper'
import { SpotifyConnection } from 'common/database'

import * as logger from 'winston'

const NAME = 'bee!queue [user] <song_name>'
const DESCRIPTION = 'Searches for and adds it to a play queue'
const COMMAND_STRING: RegExp = /^bee!queue(?:\s<@!(?<userId>\d{17,19})>?)?(?:\s(?<songName>.+))?$/

@Command.register
export class QueueSong extends BaseCommand {
  private static readonly PLAYLIST_NAME = 'The Beelist'
  private static readonly PLAYLIST_DESC = `Errybody knows it's BIG DICK BEE!`

  private helper: SpotifyHelper = SpotifyHelper.getInstance()

  constructor () {
    super(NAME, COMMAND_STRING, DESCRIPTION)
  }

  async execute (message: DiscordClient.Message, content: string): Promise<void> {
    await this.findAndPlay(message, content)
  }

  async findAndPlay (message: DiscordClient.Message, content: string) {

    try {
      if (message.guild === null || message.guild === undefined) {
        message.channel.send(`Queue only works in guild channels`).catch(logger.error)
        return
      }

      const matches = this.getMatches(message)

      const songName = matches.groups.songName

      if (!matches || !songName || songName.length === 0) {
        message.channel.send('I need a song name to search `bee!queue [search_term]`').catch(logger.error)
        return
      }

      let users: SpotifyConnection[]
      if (matches.groups.userId) {
        const user = this.helper.getConnectionForUser(matches.groups.userId)
        if (user === undefined) {
          await message.channel.send(`<@!${matches.groups.userId}> is not connected, run \`bee!connect\` to see how to join`)
          await this.crossReactMessage(message)
          return
        }

        users = [this.helper.getConnectionForUser(matches.groups.userId)]
      } else {
        users = SpotifyHelper.getInstance().getAllConnections()
      }

      let name: string = undefined
      let artist: string
      let uri: string = undefined

      if (users.length === 0) {
        await message.channel.send('There are currently no registered spotify users')
        await this.crossReactMessage(message)
        return
      }

      for (let i = 0; i < users.length; i++) {
        const userId: string = users[i].userId

        if (!uri) {
          const trackData = await this.helper.searchForTrack(songName, userId)

          if (!trackData) {
            await message.channel.send('I was unable to connect to spotify to search for tracks')
            await this.crossReactMessage(message)
            return
          }

          const tracks = trackData.body.tracks.items

          if (tracks.length === 0) {
            await message.channel.send('I was unable to find any tracks by the name ' + songName)
            await this.crossReactMessage(message)
            return
          }

          name = tracks[0].name
          artist = tracks[0].artists[0].name
          uri = tracks[0].uri

        }

        await this.helper.queueSong(uri, userId)

        await this.addToPlaylist(userId, uri, message)
      }

      const successMessage = `Added the song \`${name} by ${artist}\` to`
      if (users.length === 1) {
        await message.channel.send(`${successMessage} <@!${users[0].userId}>'s Beelist and queue`)
      } else {
        await message.channel.send(`${successMessage} The Beelist and queue for all users`)
      }

      await this.checkReactMessage(message)
    } catch (err) {
      logger.error(err)
    }

  }

  private async addToPlaylist (userId: string, uri: string, message: DiscordClient.Message) {
    try {
      let playlistId: string = await this.helper.getPlaylistForUser(userId,
        QueueSong.PLAYLIST_NAME)

      if (!playlistId) {
        playlistId = await this.helper.createPlaylistForUser(userId, QueueSong.PLAYLIST_NAME, QueueSong.PLAYLIST_DESC)
      }

      if (playlistId) {
        await this.helper.addSongToPlaylistForUser(userId, playlistId, uri)
      } else {
        await message.channel.send(`Unable to create playlist for <@!${userId}>`)
      }
    } catch (err) {
      logger.error(err)
    }
  }
}
