import { TransRights } from 'bot/commands/general/transRights'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'

describe('Echo Command', function () {
  let rights: TransRights

  beforeEach(() => {
    rights = new TransRights()
  })

  describe('Should trigger', function () {
    it('when message only says bee!transrights', async function () {
      await checkAndAssertMatches('bee!transrights')
    })
  })

  describe('Should not trigger', function () {
    it('when message does not contain "big dick bee"', async function () {
      const message = DiscordTestHelper.createMockMessage('Does not contain the trigger')
      assert.isFalse(rights.checkTrigger(message))
    })

    it('when message starts with "bee!transrights" and contains other text', async function () {
      await checkAndAssertMatches('bee!transrights and some other text')
    })

    it('when message contains "bee!transrights"', async function () {
      await checkAndAssertMatches('There is some other text here and bee!transrights just happens to appear in it ')
    })
  })

  it('should output the correct messages when the trigger is hit', async function () {
    const message = DiscordTestHelper.createMockMessage('big dick bee')
    await rights.execute(message)
    sinon.assert.calledOnce(message.channel.send)
    sinon.assert.calledWith(message.channel.send, 'TRANS RIGHTS!!!')
  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(rights.checkTrigger(message))
  }

})
