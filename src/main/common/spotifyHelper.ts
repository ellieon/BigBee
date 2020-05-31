import { DatabaseHelper, SpotifyConnection } from 'common/database'
import { EnvironmentHelper as env } from 'common/environmentHelper'
import * as SpotifyWebApi from 'spotify-web-api-node'
import * as request from 'request'
import * as logger from 'winston'

export class SpotifyHelper {

  private static instance: SpotifyHelper

  private readonly db: DatabaseHelper
  private readonly spotifyApi: SpotifyWebApi
  private spotifyConnection: SpotifyConnection = undefined

  private constructor () {
    this.spotifyApi = new SpotifyWebApi({
      clientId: env.getSpotifyClientId(),
      clientSecret: env.getSpotifyClientSecret(),
      redirectUri: env.getSpotifyCallbackUrl()
    })

    this.db = new DatabaseHelper()
  }

  public static getInstance (): SpotifyHelper {
    if (!SpotifyHelper.instance) {
      SpotifyHelper.instance = new SpotifyHelper()
    }

    return SpotifyHelper.instance
  }

  private async checkConnection (userId: string): Promise<void> {
    logger.debug(`SpotifyHelper: Checking connection for user ${userId}`)
    this.spotifyConnection = await this.db.getSpotifyKeyForUser(userId)
    if (!this.spotifyConnection) {
      return
    }

    this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken)
    this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken)

    if (this.spotifyConnection.expires <= new Date()) {
      await this.refreshTime(userId)
    }
    logger.debug(`SpotifyHelper: check connection complete`)
  }

  private async refreshTime (userId: string): Promise<void> {
    logger.debug(`SpotifyHelper: Refreshing token for ${userId}`)
    const data = await this.spotifyApi.refreshAccessToken().catch(logger.error)
    let refreshDate: Date = new Date()
    refreshDate.setSeconds(refreshDate.getSeconds() + data.body.expires_in - 10)
    this.spotifyConnection = new SpotifyConnection(data.body.access_token, data.body.refresh_token, refreshDate)
    this.spotifyApi.setAccessToken(this.spotifyConnection.connectionToken)
    this.spotifyApi.setRefreshToken(this.spotifyConnection.refreshToken)
    await this.db.updateSpotifyKeyForUser(userId, this.spotifyConnection.connectionToken, this.spotifyConnection.expires).catch(logger.error)
    logger.debug(`SpotifyHelper: refresh token done`)

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

  public async queueSong (trackUri: string, userId: string): Promise<void> {
    logger.debug(`SpotifyHelper: Queue song with trackUri: ${trackUri} for user ${userId}`)
    await this.checkConnection(userId)

    const data = await this.spotifyApi.getMyCurrentPlaybackState()

    if (data.body.is_playing) {
      const options = {
        url: `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'request',
          'Authorization': `Bearer ${this.spotifyConnection.connectionToken}`
        }
      }
      await request.post(options)
    }
    logger.debug(`SpotifyHelper: Queue song complete`)
  }
}
