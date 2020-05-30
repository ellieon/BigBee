import {Client} from "discord.js";
import * as path from "path";
import * as requireDirectory from 'require-directory'

export namespace Extension {
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
    const implementations: Constructor<BotExtension>[] = [];
    export function GetImplementations(): Constructor<BotExtension>[] {
        findAll(__dirname)
        return implementations;
    }
    export function register<T extends Constructor<BotExtension>>(ctor: T) {
        implementations.push(ctor);
        return ctor;
    }

    function findAll (path: string): void {
        requireDirectory(module, path, options)
    }
}

export abstract class BotExtension {

    private client: Client

    public getClient() {
        return this.client
    }

    public setClient(client: Client) {
        this.client = client
    }

    public abstract getName(): string

    public abstract init(): void
}
