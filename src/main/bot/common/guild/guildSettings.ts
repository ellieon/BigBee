export class GuildSettings {
  public id: string
  public disabledCommands: Map<string, string> = new Map()
  public disabledFeatures: Map<string, string> = new Map()
  public administratorCommands: Map<string, string> = new Map()
}
