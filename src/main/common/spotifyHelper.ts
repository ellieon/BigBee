import { DatabaseHelper, SpotifyConnection } from 'common/database'
import { EnvironmentHelper as env } from 'common/environmentHelper'
import * as SpotifyWebApi from 'spotify-web-api-node'
import * as request from 'request'
import * as logger from 'winston'

export class SpotifyPlaylist {
  constructor (
    public id: string,
    public name: string
  ) {
  }
}

export class SpotifyHelper {

  private static instance: SpotifyHelper

  private readonly db: DatabaseHelper
  private readonly spotifyApi: SpotifyWebApi
  private cache: Map<string, SpotifyConnection> = undefined

  private constructor () {
    this.spotifyApi = new SpotifyWebApi({
      clientId: env.getSpotifyClientId(),
      clientSecret: env.getSpotifyClientSecret(),
      redirectUri: env.getSpotifyCallbackUrl()
    })

    this.db = new DatabaseHelper()
    this.fillCache().catch(logger.error)
  }

  public static getInstance (): SpotifyHelper {
    if (!SpotifyHelper.instance) {
      SpotifyHelper.instance = new SpotifyHelper()
    }

    return SpotifyHelper.instance
  }

  private async fillCache (): Promise<void> {
    logger.debug('SpotifyHelper: Retrieving cache')
    this.cache = await this.db.getAllSpotifyKeys()
  }

  private async checkConnection (userId: string): Promise<SpotifyConnection> {
    logger.debug(`SpotifyHelper: Checking connection for user ${userId}`)

    let connection: SpotifyConnection = this.cache[userId]

    if (connection.expires <= new Date()) {
      connection = await this.refreshTime(connection)
    }

    if (connection) {
      this.spotifyApi.setAccessToken(connection.connectionToken)
      this.spotifyApi.setRefreshToken(connection.refreshToken)
    }

    logger.debug(`SpotifyHelper: check connection complete`)
    return connection
  }

  private async refreshTime (oldConnection: SpotifyConnection): Promise<SpotifyConnection> {
    logger.debug(`SpotifyHelper: Refreshing token for ${oldConnection.userId}`)
    let data = undefined
    let connection: SpotifyConnection = undefined
    try {
      this.spotifyApi.setAccessToken(oldConnection.connectionToken)
      this.spotifyApi.setRefreshToken(oldConnection.refreshToken)
      logger.debug(`SpotifyHelper: trying to refresh token with access: ${oldConnection.connectionToken}, refresh: ${oldConnection.refreshToken}`)
      data = await this.spotifyApi.refreshAccessToken()
      let refreshDate: Date = new Date()
      refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)

      connection = new SpotifyConnection(oldConnection.userId, data.body.access_token, data.body.refresh_token, refreshDate)
      this.spotifyApi.setAccessToken(connection.connectionToken)

      /*
        refreshAccessToken only returns a new access token (you'd think this would be obvious right?.......)
        So we keep the old refresh token, but change the access token with the new one.
      */
      this.spotifyApi.setRefreshToken(oldConnection.refreshToken)
      this.cache[connection.userId] = connection

      await this.db.updateSpotifyKeyForUser(connection.userId, connection.connectionToken, connection.expires)
        .catch(logger.error)
      logger.debug(`SpotifyHelper: successfully refreshed token`)

    } catch {
      logger.error('SpotifyHelper: Failed to refresh token')
    }

    logger.debug(`SpotifyHelper: refresh token done`)
    return connection
  }

  public async searchForTrack (searchQuery: string, userId: string): Promise<any> {
    logger.debug(`SpotifyHelper: Searching for track with search query: ${searchQuery} and userId ${userId}`)
    await this.checkConnection(userId)
    const trackData = await this.spotifyApi.searchTracks(searchQuery, { limit: 1 }).catch(logger.error)
    logger.debug(`SpotifyHelper: Searching for track done`)
    return trackData
  }

  public async skipTrack (userId: string): Promise<any> {
    logger.debug(`SpotifyHelper: Skipping track for ${userId}`)
    await this.checkConnection(userId)
    await this.spotifyApi.skipToNext()
    logger.debug(`SpotifyHelper: track skip done`)
  }

  public async getCurrentPlaybackState (userId: string): Promise<any> {
    logger.debug(`SpotifyHelper: Get current playback state for ${userId}`)
    await this.checkConnection(userId)
    const data = this.spotifyApi.getMyCurrentPlaybackState()
    logger.debug(`SpotifyHelper get current playback state complete`)
    return data
  }

  public async createPlaylistForUser (userId: string, playListName: string, playlistDescription: string): Promise<string> {
    logger.debug(`SpotifyHelper: create playlist for user ${userId}, ${playListName}, ${playlistDescription}`)
    await this.checkConnection(userId)
    const userDetails = await this.spotifyApi.getMe()
    const id = userDetails.body.id
    const response = await this.spotifyApi.createPlaylist(id, playListName, {
      'description': playlistDescription,
      'public': false
    })

    logger.debug(`SpotifyHelper: create playlist done`)
    return response.body.id
  }

  public async getPlaylistForUser (userId: string, playlistName: string): Promise<string> {
    logger.debug(`SpotifyHelper: Get playlist for user ${userId}, ${playlistName}`)
    await this.checkConnection(userId)
    const data = await this.spotifyApi.getUserPlaylists()
    let playLists: SpotifyPlaylist[] = data === undefined ? undefined : data.body.items

    for (let playList of playLists) {
      if (playList.name === playlistName) {
        return playList.id
      }
    }

    return undefined
  }

  public async addSongToPlaylistForUser (userId: string, playlistId: string, songUri: string): Promise<void> {
    logger.debug(`SpotifyHelper: Add song to playlist for user ${userId}, ${playlistId}, ${songUri}`)
    await this.checkConnection(userId)
    await this.spotifyApi.addTracksToPlaylist(playlistId, [songUri])
  }

  public async isUserCurrentlyListening (userId: string): Promise<boolean> {
    logger.debug(`SpotifyHelper: is user currently listening ${userId}`)
    await this.checkConnection(userId)
    const data = await this.spotifyApi.getMyCurrentPlaybackState()
    return data && data.body.is_playing
  }

  public async queueSong (trackUri: string, userId: string): Promise<void> {
    logger.debug(`SpotifyHelper: Queue song with trackUri: ${trackUri} for user ${userId}`)
    const connection: SpotifyConnection = await this.checkConnection(userId)

    const options = {
      url: `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'request',
        'Authorization': `Bearer ${connection.connectionToken}`
      }
    }
    await request.post(options)

    logger.debug(`SpotifyHelper: Queue song complete`)
  }

  async saveConnection (spotifyConnection: SpotifyConnection) {
    this.cache[spotifyConnection.userId] = spotifyConnection
    await this.db.setCurrentSpotifyKey(spotifyConnection.userId, spotifyConnection.connectionToken,
      spotifyConnection.refreshToken, spotifyConnection.expires)
      .catch(logger.error)
  }

  async deleteConnectionForUser (id: any) {
    this.cache.delete(id)
    await this.db.deleteUser(id)
  }
}
