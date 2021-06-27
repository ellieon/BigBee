import { QueueSong } from 'bot/commands/spotify/queue-song'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'
import { ImportMock } from 'ts-mock-imports'
import { MockSpotifyHelper } from '../../../helper/mockSpotifyHelper'
import { Message } from 'discord.js'

describe('Queue Command', function () {
  let queue: QueueSong

  beforeEach(() => {
    sinon.restore()
    ImportMock.restore()
    MockSpotifyHelper.createMockSpotifyHelper()
    queue = new QueueSong()
  })

  describe('When called with no user', function () {
    describe('and a song name is provided', () => {
      it('Should queue the song for each user if the song is found', async function () {
        const message = await checkAndAssertMatches('bee!queue song name')
        const spotifyApi = MockSpotifyHelper.spotify()
        // Check that the spotify api was called with the song name
        sinon.assert.calledOnce(spotifyApi.searchTracks)
        sinon.assert.calledWith(spotifyApi.searchTracks, 'song name')
        const request = MockSpotifyHelper.request()
        sinon.assert.calledTwice(request.post)
        assert.isTrue(request.post.firstCall.firstArg.url.includes(MockSpotifyHelper.trackDataFound.body.tracks.items[0].uri))

        // Test data says one user should have the playlist, one shouldnt, test for this
        sinon.assert.calledOnce(spotifyApi.createPlaylist)
        sinon.assert.calledTwice(spotifyApi.addTracksToPlaylist)
        sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 1', ['a uri'])
        sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 2', ['a uri'])
        sinon.assert.calledWith(message.channel.send, 'Added the song `A Song by An artist` to The Beelist and queue for all users')
      })

      it('Should not queue the song, and send a not found message if the song is not found', async function () {
        const message = await checkAndAssertMatches('bee!queue invalid song name')
        const spotifyApi = MockSpotifyHelper.spotify()
        sinon.assert.calledOnce(spotifyApi.searchTracks)
        sinon.assert.calledWith(spotifyApi.searchTracks, 'invalid song name')
        const request = MockSpotifyHelper.request()
        sinon.assert.notCalled(request.post)
        sinon.assert.calledWith(message.channel.send, 'I was unable to find any tracks by the name invalid song name')
      })
    })
  })

  describe('When called with a user id', function () {
    describe('When the user is valid', function () {
      it('should queue the song when the song is found', async function () {
        const message = await checkAndAssertMatches(`bee!queue <@!${MockSpotifyHelper.USER_1_ID}> song name`)
        const spotifyApi = MockSpotifyHelper.spotify()
        sinon.assert.calledOnce(spotifyApi.searchTracks)
        sinon.assert.calledWith(spotifyApi.searchTracks, 'song name')
        const request = MockSpotifyHelper.request()
        sinon.assert.calledOnce(request.post)
        assert.isTrue(request.post.firstCall.firstArg.url.includes(MockSpotifyHelper.trackDataFound.body.tracks.items[0].uri))
        sinon.assert.calledOnce(spotifyApi.addTracksToPlaylist)
        sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 1', ['a uri'])
        sinon.assert.calledWith(message.channel.send, `Added the song \`A Song by An artist\` to <@!${MockSpotifyHelper.USER_1_ID}>\'s Beelist and queue`)
      })

      it('should queue the song when the song is found and the command is sent from mobile', async function () {
        const message = await checkAndAssertMatches(`bee!queue <@${MockSpotifyHelper.USER_1_ID}> song name`)
        const spotifyApi = MockSpotifyHelper.spotify()
        sinon.assert.calledOnce(spotifyApi.searchTracks)
        sinon.assert.calledWith(spotifyApi.searchTracks, 'song name')
        const request = MockSpotifyHelper.request()
        sinon.assert.calledOnce(request.post)
        assert.isTrue(request.post.firstCall.firstArg.url.includes(MockSpotifyHelper.trackDataFound.body.tracks.items[0].uri))
        sinon.assert.calledOnce(spotifyApi.addTracksToPlaylist)
        sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 1', ['a uri'])
        sinon.assert.calledWith(message.channel.send, `Added the song \`A Song by An artist\` to <@!${MockSpotifyHelper.USER_1_ID}>\'s Beelist and queue`)
      })

      it('should output an error when the song is not found', async function () {
        const message = await checkAndAssertMatches(`bee!queue <@!${MockSpotifyHelper.USER_1_ID}> invalid song name`)
        const spotifyApi = MockSpotifyHelper.spotify()
        sinon.assert.calledOnce(spotifyApi.searchTracks)
        sinon.assert.calledWith(spotifyApi.searchTracks, 'invalid song name')
        const request = MockSpotifyHelper.request()
        sinon.assert.notCalled(request.post)
        sinon.assert.notCalled(spotifyApi.addTracksToPlaylist)
        sinon.assert.calledWith(message.channel.send, `I was unable to find any tracks by the name invalid song name`)
      })

      it('should send an error message if the user targeted isn`t connected', async function () {
        const message = await checkAndAssertMatches(`bee!queue <@!12312312312312312> song name`)
        sinon.assert.calledWith(message.channel.send, `<@!12312312312312312> is not connected, run \`bee!connect\` to see how to join`)
      })
    })
  })

  it('should output an error when called with no user or song', async function () {
    const message = await checkAndAssertMatches(`bee!queue`)
    const spotifyApi = MockSpotifyHelper.spotify()
    sinon.assert.notCalled(spotifyApi.searchTracks)
    const request = MockSpotifyHelper.request()
    sinon.assert.notCalled(request.post)
    sinon.assert.notCalled(spotifyApi.addTracksToPlaylist)
    sinon.assert.calledWith(message.channel.send, 'I need a song name to search \`bee!queue [search_term]\`')
  })

  it('should queue the song for all users twice when called twice in a row', async function () {
    // Check first call
    await checkAndAssertMatches('bee!queue song name')
    const spotifyApi = MockSpotifyHelper.spotify()
    sinon.assert.calledOnce(spotifyApi.searchTracks)
    const request = MockSpotifyHelper.request()
    sinon.assert.callCount(request.post, 2)
    assert.isTrue(request.post.firstCall.firstArg.url.includes(MockSpotifyHelper.trackDataFound.body.tracks.items[0].uri))
    sinon.assert.callCount(spotifyApi.addTracksToPlaylist, 2)
    sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 1', ['a uri'])
    sinon.assert.calledWith(spotifyApi.addTracksToPlaylist, 'Beelist For User 2', ['a uri'])
    sinon.assert.calledOnce(spotifyApi.createPlaylist)

    // Check second call
    const message = await checkAndAssertMatches('bee!queue song name')
    sinon.assert.calledTwice(spotifyApi.searchTracks)
    sinon.assert.callCount(request.post, 4)
    sinon.assert.callCount(spotifyApi.addTracksToPlaylist, 4)
    sinon.assert.calledWith(message.channel.send, 'Added the song `A Song by An artist` to The Beelist and queue for all users')

  })

  async function checkAndAssertMatches (content: string): Promise<Message> {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(queue.checkTrigger(message))
    await queue.findAndPlay(message, message.content)
    return message
  }

})
