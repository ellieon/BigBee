import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'
import {SpotifyHelper} from "../../../common/spotifyHelper";
import * as logger from 'winston'

const COMMAND_STRING = /^bee!search(?:\s(?<songName>.+))?$/
const NAME = "bee!search search <song name>"
const DESCRIPTION = 'Searches for a song on Spotify and echoes the result'

@Command.register
export class Search extends BaseCommand {

    private readonly helper: SpotifyHelper = SpotifyHelper.getInstance()
    constructor() {
        super(NAME, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params = message.content.match(COMMAND_STRING).groups.songName

        console.log(params)
        if (!params || params.length === 0) {
            message.channel.send("I need a song name to search `bee!search [search_term]`").catch(logger.error)
            this.crossReactMessage(message)
            return
        }

        const data = (await this.helper.searchForTrack(params, message.author.id)).body.tracks.items

        if(data.length === 0){
            message.channel.send(`Could not find any song for ${params}`).catch(logger.error)
            this.checkReactMessage(message)
        } else {
            let name = data[0].name;
            let artist = data[0].artists[0].name
            message.channel.send(`I found the song \`${name} by ${artist}\` when searching for \`${params}\``)
                .catch(logger.error)
            this.checkReactMessage(message)
        }
    }
}