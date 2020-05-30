import * as DiscordClient from 'discord.js'
import {BaseCommand, Command} from '../command'
import {SpotifyHelper} from "../../../common/spotifyHelper";
import {DatabaseHelper, UserID} from "../../../common/database";

import * as logger from "winston";

const NAME = "bee!queue [user] <song_name>"
const DESCRIPTION = 'Searches for and adds it to a play queue'
const COMMAND_STRING: RegExp = /^bee!queue(?:\s<@!(?<userId>\d{17,19})>?)?(?:\s(?<songName>.+))?$/


@Command.register
export class QueueSong extends BaseCommand {
    private helper: SpotifyHelper = SpotifyHelper.getInstance()
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        super(NAME, COMMAND_STRING, DESCRIPTION)
    }

    async execute(message: DiscordClient.Message): Promise<void> {
        await this.findAndPlay(message)
    }

    async findAndPlay(message: DiscordClient.Message) {
        const matches = message.content.match(COMMAND_STRING)

        const songName = matches.groups.songName

        if (!matches || !songName || songName.length === 0) {
            message.channel.send("I need a song name to search `bee!queue [search_term]`").catch(logger.error)
            return
        }

        let users: UserID[] 
        if(matches.groups.userId) {
            console.log(matches.groups.userId)
            users = [{user_id: matches.groups.userId}]
        } else {
            users = await this.db.getAllUserIds()
        }

        let name: string, artist: string, uri: string = undefined

        if(users.length === 0) {
            message.channel.send("There are currently no registered spotify users").catch(logger.error)
        }

        for (let i = 0; i < users.length; i++) {
            const userId: string = users[i].user_id

            if (!uri) {
                const trackData = await this.helper.searchForTrack(songName, userId)

                if (!trackData) {
                    message.channel.send("I was unable to connect to spotify to search for tracks").catch(logger.error)
                    this.crossReactMessage(message)
                    return
                }

                const tracks = trackData.body.tracks.items

                if (tracks.length === 0) {
                    message.channel.send("I was unable to find any tracks by the name" + songName).catch(logger.error)
                    this.crossReactMessage(message)
                    return
                }

                name = tracks[0].name;
                artist = tracks[0].artists[0].name
                uri = tracks[0].uri

            }

            await this.helper.queueSong(uri, userId).catch(logger.error)
        }

        const successMessage = `Added the song \`${name} by ${artist}\` to`
        if(users.length === 1) {
            message.channel.send(`${successMessage} <@!${users[0].user_id}>'s queue`)
                .catch(logger.error)
        } else {
            message.channel.send(`${successMessage}  all users queue`)
                .catch(console.log)
        }

        this.checkReactMessage(message)

    }
}