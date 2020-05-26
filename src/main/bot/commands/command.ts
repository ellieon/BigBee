import * as DiscordClient from 'discord.js'

export abstract class Command {
    static readonly DEBUG_ENV = 'debug'
    static readonly PROD_ENV = 'prod'

    private client: DiscordClient.Client;

    protected constructor(
        private name: string,
        private prefixRequired: boolean,
        private commandString: string,
        private environments: string[],
        private description?: string,
        private helpText?: string,
        private readonly PREFIX: string = 'bee!'
    ) {
    }


    abstract async execute(message: DiscordClient.Message): Promise<void>

    getTrigger() : string {
        if (this.prefixRequired) {
            return `${this.PREFIX}${this.commandString}`

        } else {
            return this.commandString
        }
    }

    public setClient(client: DiscordClient.Client) {
        this.client = client
    }

    public getClient() {
        return this.client
    }

    getName(): string {
        return this.name
    }

    getEnvironments(): string[] {
        return this.environments
    }

    getDescription(): string {
        return this.description
    }

    getHelpText(): string {
        return this.helpText
    }
}
