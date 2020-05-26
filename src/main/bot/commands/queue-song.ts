import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {SpotifyHelper} from "../../common/spotifyHelper";

const COMMAND_STRING = 'queue'
const NAME = 'queue'
const DESCRIPTION = 'Searches for and adds it to a play queue'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

function handleError(err): void {
    console.log(err)
}

export class QueueSong extends Command {
    private helper: SpotifyHelper = new SpotifyHelper();
    constructor() {
        super(NAME, true, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params: string = message.content.substr(this.getTrigger().length, message.content.length)
        console.log(params)
        await this.findAndPlay(message, params)
    }

    async findAndPlay(message: DiscordClient.Message, params: string) {
        if(params.length === 0) {
            message.channel.send("I need a song name to search `bee!queue [search_term]`").catch(handleError)
            return
        }

        const data = (await this.helper.searchForTrack(params)).body.tracks.items

        if(data.length === 0){
            message.channel.send(`I was unable to find any tracks by the name\`${params}\``).catch(handleError)
        }

        const name = data[0].name;
        const artist = data[0].artists[0].name


        this.addSongToQueue(data[0].uri, message).catch(handleError)
        await message.channel.send(`Adding the song \`${name} by ${artist}\` to the current user's play queue`)
            .catch(handleError)
    }

    async addSongToQueue(trackUri: string, message: DiscordClient.Message) {
        this.helper.queueSong(trackUri).catch(() => {
            message.channel.send("I was unable to add the song to the user's queue")
        });
    }
}