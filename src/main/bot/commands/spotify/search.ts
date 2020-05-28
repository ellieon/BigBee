import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'
import {SpotifyHelper} from "../../../common/spotifyHelper";

const COMMAND_STRING = 'search'
const NAME = "bee!search search <song name>"
const DESCRIPTION = 'Searches for a song on Spotify and echoes the result'

@Command.register
export class Search extends BaseCommand {

    private readonly helper: SpotifyHelper = SpotifyHelper.getInstance()
    constructor() {
        super(NAME, true, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params: string = this.getParams(message)

        console.log(params)
        if (!params || params.length === 0) {
            message.channel.send("I need a song name to search `bee!search [search_term]`").catch(console.log)
            return
        }

        const data = (await this.helper.searchForTrack(params, message.author.id)).body.tracks.items

        if(data.length === 0){
            message.channel.send(`Could not find any song for ${params}`).catch(console.log)
        } else {
            let name = data[0].name;
            let artist = data[0].artists[0].name
            message.channel.send(`I found the song \`${name} by ${artist}\` when searching for \`${params}\``)
                .catch(console.log)
        }
    }
}