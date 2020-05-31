import { Echo } from 'bot/commands/general/echo'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'

describe('Echo Command', function () {
  let echo: Echo

  beforeEach(() => {
    echo = new Echo()
  })

  describe('Should trigger', function () {
    it('when message only says "big dick bee"', async function () {
      await checkAndAssertMatches('big dick bee')
    })

    it('when message starts with "big dick bee" and contains other text', async function () {
      await checkAndAssertMatches('big dick bee and some other text')
    })

    it('when message contains "big dick bee"', async function () {
      await checkAndAssertMatches('There is some other text here and big dick bee just happens to appear in it ')
    })
  })

  describe('Should not trigger', function () {
    it('when message does not contain "big dick bee"', async function () {
      const message = DiscordTestHelper.createMockMessage('Does not contain the trigger')
      assert.isFalse(echo.checkTrigger(message))
    })
  })

  it('should output the correct messages when the trigger is hit', async function () {
    const message = DiscordTestHelper.createMockMessage('big dick bee')
    await echo.execute(message)
    sinon.assert.calledThrice(message.channel.send)
    sinon.assert.calledWith(message.channel.send, 'BIG')
    sinon.assert.calledWith(message.channel.send, 'DICK')
    sinon.assert.calledWith(message.channel.send, 'BEE')
  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(echo.checkTrigger(message))
  }

})
