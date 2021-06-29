import { BotExtension, Extension } from 'bot/extensions/botExtension'
import { DatabaseHelper } from 'common/database'

require('common/ExtendendedMessage')

@Extension.register
export class Bonk extends BotExtension {

  private readonly EMOJI_REGEX: RegExp = /<:hornyjpg:\d{17,19}>/

  public init (): void {
    this.getClient().on('message', message => {
      this.handleMessage(message).catch()
    })
  }

  private async handleMessage (message) {
    if (message.reference && message.content.toLowerCase().match(this.EMOJI_REGEX)) {
      const replied = await message.channel.messages.fetch(message.reference.messageID)

      const reacts = await DatabaseHelper.getInstance().getBonkReacts()
      if (reacts.length > 0) {
        await replied.inlineReply(reacts[Math.floor(Math.random() * reacts.length)], undefined)
        await message.delete()
      } else {
        await replied.inlineReply('I have no gifs and I want to bonk')
      }
    }
  }

  public getName (): string {
    return 'Greeter'
  }
}
