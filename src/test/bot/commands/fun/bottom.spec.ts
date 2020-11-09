import { Bottom } from 'bot/commands/fun/bottom'
import * as sinon from 'sinon'
import { assert, expect } from 'chai'
import { DiscordTestHelper } from '../../../helper/discordTestingHelper'

describe('Bottom Command', function () {
  let bottom: Bottom

  beforeEach(() => {
    bottom = new Bottom()
  })

  describe('Should trigger', function () {
    it('when message only says "🥺"', async function () {
      await checkAndAssertMatches('🥺')
    })

    it('when message starts with "🥺" and contains other text', async function () {
      await checkAndAssertMatches('🥺')
    })

    it('when message contains "🥺"', async function () {
      await checkAndAssertMatches('There is some other text here and 🥺 just happens to appear in it ')
    })

    it(`when message contains "👉👈"`, async function () {
      await checkAndAssertMatches('👉👈')
    })

    it(`when message contains "👉👈" and "🥺"`, async function () {
      await checkAndAssertMatches('👉👈🥺')
    })

    it('should trigger when `>.<` is typed', async function () {
      await checkAndAssertMatches('>.<')
    })

    it('should trigger when `>_<` is typed', async function () {
      await checkAndAssertMatches('>_<')
    })

    it('should trigger when `😤` is typed', async function () {
      await checkAndAssertMatches('😤')
    })
    it('should trigger when `≥.≤` is typed', async function () {
      await checkAndAssertMatches('≥.≤')
    })
    it('should trigger when `:AmyBrat:` is typed', async function () {
      await checkAndAssertMatches('<:AmyBrat:775351028371030016>')
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

  it('should output the correct messages when the trigger is hit', async function () {
    const message = DiscordTestHelper.createMockMessage('🥺')
    await bottom.execute(message)
    expect((message.react as sinon.spy).callCount).to.equal(6)
  })

  async function checkAndAssertMatches (content: string) {
    const message = DiscordTestHelper.createMockMessage(content)
    assert(bottom.checkTrigger(message))
  }

})
