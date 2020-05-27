import * as DiscordClient from 'discord.js'
import * as requireDirectory from 'require-directory'
import * as path from 'path'
import {Message} from "discord.js";

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
        new(...args: any[]): T;
        readonly prototype: T;
    }
    const implementations: Constructor<BaseCommand>[] = [];
    export function GetImplementations(): Constructor<BaseCommand>[] {
        findAll(__dirname)
        return implementations;
    }
     export function register<T extends Constructor<BaseCommand>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }

    function findAll (path: string): void {
        const routes: object = requireDirectory(module, path, options)
    }
}

export abstract class BaseCommand {

    private client: DiscordClient.Client;

    protected constructor(
        private name: string,
        private prefixRequired: boolean,
        private commandString: string,
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

    getParams(message: Message): string {
        if(!message) {
            return undefined
        }
        const content = message.content
        if (this.prefixRequired && content.length > this.getTrigger().length + 1) {
            return message.content.substr(this.getTrigger().length + 1, message.content.length)
        } else {
            return ""
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

    getDescription(): string {
        return this.description
    }

    getHelpText(): string {
        return this.helpText
    }
}

