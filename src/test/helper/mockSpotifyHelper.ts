import * as DatabaseHelper from 'common/database'
import * as sinon from 'sinon'
import * as database from './databaseTestingHelper'

export class MockSpotifyHelper {

  public static readonly today: Date = new Date()

  public static readonly USER_1_ID: string = '11111111111111111'
  public static readonly USER_2_ID: string = '22222222222222222'

  public static readonly mockConnectionData: Map<String, DatabaseHelper.SpotifyConnection> = new Map([
    [MockSpotifyHelper.USER_1_ID, new DatabaseHelper.SpotifyConnection(MockSpotifyHelper.USER_1_ID, 'ca', 'ra', MockSpotifyHelper.getTomorrow())],
    [MockSpotifyHelper.USER_2_ID, new DatabaseHelper.SpotifyConnection(MockSpotifyHelper.USER_2_ID, 'cb', 'rb', new Date())]
  ])

  public static readonly playListWithExpected = {
    body: {
      items: [
        {
          name: 'not the one',
          id: '0'
        },
        {
          name: 'The Beelist',
          id: 'Beelist For User 1'
        }
      ]
    }
  }

  public static readonly playlistsWithoutExpected = {
    body: {
      items: [
        {
          name: 'not the one',
          id: '0'
        }
      ]
    }
  }
  public static readonly trackDataFound = {
    body: {
      tracks: {
        items: [
          { name: 'A Song', uri: 'a uri', artists: [{ name: 'An artist' }] }
        ]
      }
    }
  }

  public static readonly trackDataNotFound = {
    body: {
      tracks: {
        items: []
      }
    }
  }

  public static readonly refreshData = {
    body: {
      access_token: 'new token',
      expires_in: 3600
    }
  }

  static spotify () {
    return require('spotify-web-api-node').prototype
  }

  static request () {
    return require('request')
  }

  static createMockSpotifyHelper () {
    database.databaseHelperMock.getAllSpotifyKeys = sinon.mock()
    database.databaseHelperMock.getAllSpotifyKeys.returns(this.mockConnectionData)
    this.setupSpotifyApi()
    this.setupRequest()
  }

  private static getTomorrow (): Date {
    let tomorrow = new Date()
    tomorrow.setDate(new Date().getDate() + 1)
    return tomorrow
  }

  private static setupSpotifyApi () {
    let api = require('spotify-web-api-node')

    let searchTracks = sinon.stub(api.prototype, 'searchTracks')
    searchTracks.returns(this.trackDataNotFound)
    searchTracks.withArgs('song name').returns(this.trackDataFound)
    sinon.stub(api.prototype, 'setAccessToken')
    sinon.stub(api.prototype, 'setRefreshToken')
    sinon.stub(api.prototype, 'refreshAccessToken').returns(this.refreshData)
    sinon.stub(api.prototype, 'getUserPlaylists').callsFake(() => {
      if (api.prototype.setAccessToken.lastCall.firstArg === 'ca') {
        return this.playListWithExpected
      } else if (api.prototype.setAccessToken.lastCall.firstArg === 'new token') {
        return this.playlistsWithoutExpected
      }
    })
    sinon.stub(api.prototype, 'createPlaylist').returns({ body: { id: 'Beelist For User 2' } })
    sinon.stub(api.prototype, 'getMe').returns({ body: { id: this.USER_2_ID } })
    sinon.stub(api.prototype, 'addTracksToPlaylist')
  }

  private static setupRequest () {
    let request = this.request()
    sinon.stub(request, 'post')
  }

}
