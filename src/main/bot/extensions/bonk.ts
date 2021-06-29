import { BotExtension, Extension } from 'bot/extensions/botExtension'
import { DatabaseHelper } from 'common/database'

require('common/ExtendendedMessage')

@Extension.register
export class Bonk extends BotExtension {

  public readonly EMPTY_REACTION_MESSAGE = 'I have no gifs and I must bonk'
  private readonly EMOJI_REGEX: RegExp = /^bonk$/

  public init (): void {
    this.getClient().on('message', message => {
      this.handleMessage(message).catch()
    })
  }

  private async handleMessage (message) {
    if (message.reference && message.content.toLowerCase().match(this.EMOJI_REGEX)) {
      const replied = await message.channel.messages.fetch(message.reference.messageID)
      await this.replyToMessage(replied, message)
    }
  }

  private async replyToMessage (message, original) {
    const reacts = await DatabaseHelper.getInstance().getBonkReacts()
    if (reacts.length > 0) {
      await message.inlineReply(reacts[Math.floor(Math.random() * reacts.length)], undefined)
      await original.delete()
    } else {
      await message.inlineReply(this.EMPTY_REACTION_MESSAGE)
    }
  }
  public getName (): string {
    return 'BONK'
  }
}
