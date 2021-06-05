import { Bottom } from 'bot/commands/fun/bottom'
import * as sinon from 'sinon'
import { assert, expect } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'
import * as database from '../../../helper/databaseTestingHelper'

describe('Bottom Command', function () {
  let bottom: Bottom

  beforeEach(() => {
    bottom = new Bottom()
    database.databaseHelperMock.getTriggers.returns(['🥺'])
  })

  describe('Should trigger', function () {
    it('when message contains one of the trigger emoji', async function () {
      await checkAndAssertMatches('🥺')
    })
  })

  describe('Should not trigger', function () {
    it('when message does not contain "🥺"', async function () {
      const message = DiscordTestHelper.createMockMessage('Does not contain the trigger')
      assert.isFalse(bottom.checkTrigger(message))
    })
    it('when message has >< with something in the middle"', async function () {
      const message = DiscordTestHelper.createMockMessage('>l<')
      assert.isFalse(bottom.checkTrigger(message))
    })
  })

  describe('Add trigger', function () {
    it('when a user is an admin, it should add the provided trigger to the database', async function () {
      const message = DiscordTestHelper.createMockMessage('bee!bottom-add word')
      database.databaseHelperMock.getBeeAdmins.returns([DiscordTestHelper.MOCK_USER_ID])
      await bottom.execute(message, message.content)
      sinon.assert.calledWith(database.databaseHelperMock.pushNewTriggers,'["🥺","word"]')
    })

    it('when a user is not an admin, it should not add the trigger to the database',async function () {
      const message = DiscordTestHelper.createMockMessage('bee!bottom-add word')
      database.databaseHelperMock.pushNewTriggers.reset()
      database.databaseHelperMock.getBeeAdmins.returns(['Some user'])
      await bottom.execute(message, message.content)
      assert(database.databaseHelperMock.pushNewTriggers.notCalled)
    })
  })

  describe('Remove trigger', function () {
    it('when a user is an admin, it should remove the provided trigger from the database', async function () {
      const message = DiscordTestHelper.createMockMessage('bee!bottom-remove 🥺')
      database.databaseHelperMock.getBeeAdmins.returns([DiscordTestHelper.MOCK_USER_ID])
      await bottom.execute(message, message.content)
      sinon.assert.calledWith(database.databaseHelperMock.pushNewTriggers,'[]')
    })

    it('when a user is not an admin, it should not add the trigger to the database',async function () {
      const message = DiscordTestHelper.createMockMessage('bee!bottom-remove word')
      database.databaseHelperMock.pushNewTriggers.reset()
      database.databaseHelperMock.getBeeAdmins.returns(['Some user'])
      await bottom.execute(message, message.content)
      assert(database.databaseHelperMock.pushNewTriggers.notCalled)
    })
  })

  it('should output the correct messages when the trigger is hit', async function () {
    const message = DiscordTestHelper.createMockMessage('🥺')
    await bottom.execute(message, message.content)
    expect((message.react as sinon.spy).callCount).to.equal(6)
    sinon.assert.calledWith(database.databaseHelperMock.incrementScoreBoardForUser, message.author.id)
  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(bottom.checkTrigger(message))
  }

})
