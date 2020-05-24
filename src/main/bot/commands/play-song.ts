import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {EnvironmentHelper as env} from "../../common/environmentHelper";
import {DatabaseHelper} from "../../common/database";
import * as SpotifyWebApi from 'spotify-web-api-node'
const request = require('request')

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
        if(params.length === 0) {
            message.channel.send("I need a song name to search `bee!play [search_term]`").catch(handleError)
            return
        }

        const code = await this.db.getCurrentSpotifyKey().catch(handleError);
        this.spotifyApi.setAccessToken(code);

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
       // const context = data.body.tracks.items[0].album.uri
       // const offset = data.body.tracks.items[0].track_number - 1

        this.addSongToQueue(data.body.tracks.items[0].uri, code, message).catch(handleError)
        await message.channel.send(`Adding the song ${name} by ${artist} to the current user's play queue`)
            .catch(handleError)
        // await this.spotifyApi.play({
        //     'context_uri': context,
        //     'offset': {
        //         "position": offset
        //     }
        // }).catch(() =>
        //     message.channel.send("I could not play the song (Maybe I don't have Spotify permission)").catch(handleError)
        // )
    }


    //TODO This is fucking horrible code, and I need to sort it out once the web client has support for queueing
    async addSongToQueue(trackUri: string, token: void | string, message: DiscordClient.Message) {
        const options = {
            url: `https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'request',
                'Authorization':  `Bearer ${token}`
            }
        };
        request.post(
          options,
            function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                }

                if(error) {
                    message.channel
                        .send('I could not play the song (Maybe I don\'t have Spotify permission)').catch(handleError)
                }
            }
        );
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


}