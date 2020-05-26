import * as DiscordClient from 'discord.js'
import {Command} from './command'
import {DatabaseHelper} from "../../common/database";
import {SpotifyHelper} from "../../common/spotifyHelper";

const COMMAND_STRING = 'skip'
const NAME = 'skip'
const DESCRIPTION = 'Skips to the next song in spotify'
const ENVIRONMENTS = [Command.DEBUG_ENV, Command.PROD_ENV]


export class Skip extends Command {
    readonly helper: SpotifyHelper = new SpotifyHelper()
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, true, COMMAND_STRING, ENVIRONMENTS, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await this.skipSongAndOutput(message)
    }

    async skipSongAndOutput(message: DiscordClient.Message) {
        await this.helper.skipTrack()
        await this.sleep(1000)
        this.helper.getCurrentPlaybackState()
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