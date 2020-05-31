import * as Discord from 'discord.js'
import { Echo } from '../../../../main/bot/commands/general/echo'
import * as sinon from 'sinon'
import { Message } from 'discord.js'


describe('Echo Command', function () {
  let echo: Echo

  beforeEach(() => echo = new Echo())

  describe('Should trigger', function () {
    it('when message only says "big dick bee"', async function () {
      await executeAndAssertPositive('big dick bee')
    })

    it('when message starts with "big dick bee" and contains other text', async function () {
      await executeAndAssertPositive('big dick bee and some other text')
    })

    it('when message contains "big dick bee"', async function () {
      await executeAndAssertPositive('There is some other text here and big dick bee just happens to appear in it ')
    })
  })

  describe('Should not trigger', function () {
    it('when message does not contain "big dick bee"', async function () {
      const message = createMockMessage('Does not contain the trigger')
      await echo.execute(message)
      sinon.assert.notCalled(message.channel.send)
    })
  })


  async function executeAndAssertPositive (content: string) {
    const message = createMockMessage(content)
    await echo.execute(message)
    sinon.assert.calledThrice(message.channel.send)
    sinon.assert.calledWith(message.channel.send, 'BIG')
    sinon.assert.calledWith(message.channel.send, 'DICK')
    sinon.assert.calledWith(message.channel.send, 'BEE')
  }

  function createMockMessage (content: string) {
    let message: Message = sinon.createStubInstance(Discord.Message)
    message.content = content
    message.channel = sinon.createStubInstance(Discord.TextChannel)
    message.channel.send = sinon.spy()


    return message

  }
})
