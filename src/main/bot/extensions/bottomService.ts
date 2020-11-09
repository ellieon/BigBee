import * as DiscordClient from 'discord.js'
import { BotExtension, Extension } from 'bot/extensions/botExtension'

@Extension.register
export class BottomService extends BotExtension {
  public init (): void {
    this.getClient().on('message', (message) => {
        this.checkMessage(message)
    })
  }

  private async checkMessage(message: DiscordClient.Message) {

  }

  
  public getName (): string {
    return 'Greeter'
  }

}
