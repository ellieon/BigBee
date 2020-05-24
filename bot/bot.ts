import {Client as DiscordClient} from "@typeit/discord";
import {EnvironmentHelper as env} from "./../common/environmentHelper";
import {DatabaseHelper} from "../common/database";

const SpotifyWebApi = require('spotify-web-api-node')
const logger = require('winston');

export class BeeBot {
    readonly bot = new DiscordClient()
    readonly spotifyApi
    readonly db: DatabaseHelper = new DatabaseHelper()

    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId: env.getSpotifyClientId(),
            clientSecret: env.getSpotifyClientSecret()
        });
    }

    isOnDebugChannel(message): boolean {
        return env.isDevelopmentMode() && message.channel.name === env.getDebugChannelName()
    }

    notOnDebug(message): boolean {
        return !env.isDevelopmentMode() && message.channel.name !== env.getDebugChannelName()
    }

    init() {
        logger.remove(logger.transports.Console);
        logger.add(new logger.transports.Console, {
            colorize: true
        });

        logger.level = 'debug';

        this.bot.on('ready', () => {
            logger.info('Connected');
            logger.info(`Environment = ${env.getEnvironment()}`)
            logger.info(`Debug channel = ${env.getDebugChannelName()}`)
        });

        this.bot.on('message', message => {
            if (this.notOnDebug(message)) { //These are commands that only run in production mode
                logger.info('Production command')
                if (message.content.toLowerCase().includes('big dick bee')) {
                    message.channel.send('BIG');
                    message.channel.send('DICK');
                    message.channel.send('BEE');
                }

                if (message.content.startsWith('bee!')) {
                    switch (message.content.toLowerCase().substring(4, message.content.length)) {
                        case "skip":
                            this.skipSongAndOutput(message)
                            break
                    }
                }
            } else if (this.isOnDebugChannel(message)) {
                logger.info('Debug command')
                if (message.content.toLowerCase().includes('big dick bee')) {
                    message.channel.send('BIG');
                    message.channel.send('DICK');
                    message.channel.send('BEE');
                }
                if (message.content.startsWith('bee!')) {
                    switch (message.content.toLowerCase().substring(4, message.content.length)) {
                        case "skip":
                            this.skipSongAndOutput(message)
                            break
                    }
                }
            }
        });


        this.bot.login(env.getDiscordBotToken());
    }

    skipSongAndOutput(message) {
        this.db.getCurrentSpotifyKey()
            .then((code) => {
                this.spotifyApi.setAccessToken(code)
            })
            .then(() => {
                this.spotifyApi.skipToNext()
            })
            .then(() => this.sleep(1000))
            .then(() => {
                return this.spotifyApi.getMyCurrentPlaybackState()
            })
            .then((data) => {
                message.channel.send(
                    `I have skipped the song, the now playing song is: ${data.body.item.name} by ${data.body.item.artists[0].name}`
                )
            }, function (err) {
                message.channel.send(`I was unable to skip the song, I might not have an authorisation code for Spotify`)
                console.log(err)
            }
        )
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

}


