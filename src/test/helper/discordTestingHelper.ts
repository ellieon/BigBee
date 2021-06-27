import { Client, ClientUser, Message, TextChannel, User } from 'discord.js'
import * as sinon from 'sinon'
import { BeeBot } from 'bot/bot'

export class DiscordTestHelper {

  public static readonly MOCK_USER_STRING = '<@!123456789123456782>'
  public static readonly MOCK_MOBILE_USER_STRING = '<@123456789123456782>'
  public static readonly MOCK_USER_ID = 'mock-id'
  public static createMockMessage (content: string) {
    let message: Message = sinon.createStubInstance(Message)
    sinon.stub(message, 'guild').value(sinon.createStubInstance(Message))
    message.content = content
    message.author = sinon.createStubInstance(User)
    message.author.id = this.MOCK_USER_ID
    message.channel = sinon.createStubInstance(TextChannel)
    message.channel.send = sinon.spy()
    return message
  }

  public static async createBot (): Promise<BeeBot> {
    const bot = new BeeBot()
    const client: Client = sinon.createStubInstance(Client)
    let user: ClientUser = sinon.createStubInstance(ClientUser)
    user.id = DiscordTestHelper.MOCK_USER_ID
    client.user = user
    await bot.init(client)

    return bot
  }
}
