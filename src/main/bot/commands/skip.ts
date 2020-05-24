import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {EnvironmentHelper as env} from "../../common/environmentHelper";
import {DatabaseHelper} from "../../common/database";
import * as SpotifyWebApi from 'spotify-web-api-node'

const COMMAND_STRING = 'skip'
const NAME = 'skip'
const DESCRIPTION = 'Skips to the next song in spotify'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]

function handleError(err): void {
    console.log(err)
}

export class Skip extends Command {
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
        await this.skipSongAndOutput(message)
    }

    async skipSongAndOutput(message: DiscordClient.Message) {
        const code = await this.db.getCurrentSpotifyKey().catch(handleError);
        this.spotifyApi.setAccessToken(code);
        await this.spotifyApi.skipToNext().catch(handleError);
        await this.sleep(1000)
        this.spotifyApi.getMyCurrentPlaybackState()
            .then((data) => {
                message.channel.send(
                    `I have skipped the song, the now playing song is: ${data.body.item.name} by ${data.body.item.artists[0].name}`
                )},
                function (err) {
                    message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
                    console.log(err)
                })
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }


}