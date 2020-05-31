import * as requireDirectory from 'require-directory'
import * as path from 'path'
import { Message, Client } from 'discord.js'
import { BeeBot } from 'bot/bot'
import * as logger from 'winston'

export namespace Command {
  const fileExtension: string = path.extname(__filename).slice(1)
  const options: object = {

    extensions: [fileExtension],
    recurse: true,
    visit: (obj: any) => {
      return (typeof obj === 'object' && obj.default !== undefined) ? obj.default : obj
    }
  }

  export type Constructor<T> = {
    readonly prototype: T;
    new (...args: any[]): T;
  }
  const implementations: Constructor<BaseCommand>[] = []

  export function GetImplementations (): Constructor<BaseCommand>[] {
    findAll(__dirname)
    return implementations
  }

  export function register<T extends Constructor<BaseCommand>> (ctor: T) {
    implementations.push(ctor)
    return ctor
  }

  function findAll (path: string): void {
    requireDirectory(module, path, options)
  }
}

export abstract class BaseCommand {

  // private static readonly PREFIX: string = EnvironmentHelper.isDevelopmentMode() ? 'dbee!' : 'bee!'

  public static readonly EVERYONE_PATTERN = /@(everyone|here)/

  public static readonly USERS_PATTERN = /<@!?(\d{17,19})>/

  public static readonly ROLES_PATTERN = /<@&(\d{17,19})>/

  public static readonly CHANNELS_PATTERN = /<#(\d{17,19})>/

  private client: Client
  private bot: BeeBot

  protected constructor (
    private name: string,
    private commandString: RegExp,
    private description?: string
  ) {
  }

  abstract async execute (message: Message): Promise<void>

  getTrigger (): RegExp {
    return this.commandString
  }

  public setClient (client: Client) {
    this.client = client
  }

  public getClient () {
    return this.client
  }

  public setBot (bot: BeeBot) {
    this.bot = bot
  }

  public getBot () {
    return this.bot
  }

  public getName (): string {
    return this.name
  }

  public getDescription (): string {
    return this.description
  }

  protected checkReactMessage (message: Message) {
    message.react('✅').catch(logger.error)
  }

  protected crossReactMessage (message: Message) {
    message.react('❎').catch(logger.error)
  }
}
