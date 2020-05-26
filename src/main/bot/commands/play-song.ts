import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {EnvironmentHelper as env} from "../../common/environmentHelper";
import {DatabaseHelper, SpotifyConnection} from "../../common/database";
import * as SpotifyWebApi from 'spotify-web-api-node'

const COMMAND_STRING = 'play'
const NAME = 'play'
const DESCRIPTION = 'Searches for and plays a song in spotify'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

function handleError(err): void {
    console.log(err)
}

export class PlaySong extends Command {
    readonly spotifyApi
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, true, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
        this.spotifyApi = new SpotifyWebApi({
            clientId: env.getSpotifyClientId(),
            clientSecret: env.getSpotifyClientSecret()
        });
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        const params: string = message.content.substr(this.getTrigger().length, message.content.length)
        console.log(params)
        await this.findAndPlay(message, params)

    }

    async findAndPlay(message: DiscordClient.Message, params: string) {
        if (params.length === 0) {
            message.channel.send("I need a song name to search `bee!play [search_term]`").catch(handleError)
            return
        }

        const code: SpotifyConnection = await this.db.getSpotifyKeyForUser()
        this.spotifyApi.setAccessToken(code.connectionToken);

        const data = await this.spotifyApi.searchTracks(params, { limit: 1 }).catch(() => {
            message.channel.send('I was unable to connect to Spotify to search').catch(handleError)
        })

        const tracks = data.body.tracks.items


        if(tracks.length === 0) {
            message.channel.send(`I could not find a song that matches ${params}`).catch(handleError)
            return
        }

        const name = data.body.tracks.items[0].name;
        const artist = data.body.tracks.items[0].artists[0].name
        const context = data.body.tracks.items[0].album.uri
        const offset = data.body.tracks.items[0].track_number - 1
        await message.channel.send(`Playing the song ${name} by ${artist}`).catch(handleError)
        await this.spotifyApi.play({
            'context_uri': context,
            'offset': {
                "position": offset
            }
        }).catch(() =>
            message.channel.send("I could not play the song (Maybe I don't have Spotify permission)").catch(handleError)
        )
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


}