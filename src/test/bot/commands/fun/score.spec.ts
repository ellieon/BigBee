import * as database from '../../../helper/databaseTestingHelper'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'
import { Score } from 'bot/commands/fun/score'

describe('Score Command', function () {
  let bottom: Score

  beforeEach(() => {
    bottom = new Score()
  })

  describe('Should trigger', function () {
    it('When a message contains bee!bottom', async function () {
      await checkAndAssertMatches('bee!bottom')
    })

    it('When a message contains bee!bottom and a user', async function () {
      await checkAndAssertMatches(`bee!bottom ${DiscordTestHelper.MOCK_USER_STRING}`)
    })
  })

  describe('Should not trigger', function () {
    it('when message does not contain the trigger', async function () {
      const message = DiscordTestHelper.createMockMessage('Does not contain the trigger')
      assert.isFalse(bottom.checkTrigger(message))
    })
    it('when message contains other text too', async function () {
      const message = DiscordTestHelper.createMockMessage('fjlds;fbee!bottom')
      assert.isFalse(bottom.checkTrigger(message))
    })
  })

  describe('When triggered', function() {
    it('should output the usage message when the trigger is hit without a user', async function () {
      const message = DiscordTestHelper.createMockMessage('bee!bottom')
      await bottom.execute(message, message.content)
      sinon.assert.calledWith(message.channel.send, `Please tag a user, (bee!bottom @user)`)
    })

    it('should output a count when the trigger is hit with a user', async function () {
      const message = DiscordTestHelper.createMockMessage(`bee!bottom ${DiscordTestHelper.MOCK_USER_STRING}`)
      database.databaseHelperMock.getScoreForUser.returns(5)
      await bottom.execute(message, message.content)
      sinon.assert.calledWith(message.channel.send, `${DiscordTestHelper.MOCK_USER_STRING} has been a bottom 5 times!`)

    })

  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(bottom.checkTrigger(message))
  }

})
