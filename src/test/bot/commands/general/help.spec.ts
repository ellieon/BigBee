import { assert } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'
import { Help } from 'bot/commands/general/help'
import * as sinon from 'sinon'
import { BeeBot } from 'bot/bot'

describe('Help Command', function () {
  let help: Help

  beforeEach(async () => {
    help = new Help()
    const bot: BeeBot = await DiscordTestHelper.createBot()

    help.setBot(bot)
    help.setClient(bot.getClient())
  })

  describe('Should trigger', function () {
    it('only when message says bee!help"', async function () {
      await checkAndAssertMatches('bee!help')
    })
  })

  describe('Should not trigger', function () {
    it('when message is not bee!help"', async function () {
      const message = DiscordTestHelper.createMockMessage('Does not contain the trigger')
      assert.isFalse(help.checkTrigger(message))
    })

    it('when message contains bee!help at the start', async function () {
      const message = DiscordTestHelper.createMockMessage('bee!help some stuff that should fail this')
      assert.isFalse(help.checkTrigger(message))
    })

    it('when message contains bee!help', async function () {
      const message = DiscordTestHelper.createMockMessage('some stuff bee!help some stuff that should fail this')
      assert.isFalse(help.checkTrigger(message))
    })
  })

  it('should output the correct messages when the trigger is hit', async function () {
    const message = DiscordTestHelper.createMockMessage('big dick bee')
    await help.execute(message)
    sinon.assert.calledOnce(message.channel.send)
  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(help.checkTrigger(message))
  }

})
