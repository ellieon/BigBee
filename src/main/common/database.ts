import {EnvironmentHelper as env} from "./environmentHelper";
import * as logger from 'winston'

const Pool = require('pg').Pool

export class SpotifyConnection {
    constructor(
        public connectionToken: string,
        public refreshToken: string,
        public expires: Date
    ) {
    }
}

export class UserID {
    user_id: string
}

export class DatabaseHelper {

    private static readonly CREATE_UPDATE: string = `
    INSERT INTO spotify_connections VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO
        UPDATE SET connection_token = $2, refresh_token = $3, expires = $4
   `
    private static readonly GET_KEY: string =
            `SELECT connection_token, refresh_token, expires FROM spotify_connections WHERE user_id=$1`
    private static readonly GET_USERS: string = `SELECT user_id FROM spotify_connections`
    private static readonly DELETE_USERS: string = `DELETE from spotify_connections WHERE user_id=$1`

    readonly pool = new Pool({
        connectionString: env.getDatabaseURL()
    })

    constructor() {
    }

    async getSpotifyKeyForUser(userId: string): Promise<SpotifyConnection> {
        logger.debug(`DatabaseHelper: get spotify key for ${userId}`)
        const res =
            await this.pool.query(
                DatabaseHelper.GET_KEY, [userId]).catch(logger.error)

        if (res.rows.length === 0) {
            logger.debug(`DatabaseHelper: found no user`)
            return undefined
        } else {
            logger.debug(`DatabaseHelper: found a user`)
            const row = res.rows[0];
            let expires: Date = new Date(row.expires)
            return new SpotifyConnection(row.connection_token, row.refresh_token, expires)
        }
    }

    async setCurrentSpotifyKey(
        userId: string, connection_token: string, refresh_token: string, expires: Date): Promise<void> {
        logger.debug(`DatabaseHelper: set spotify key ${userId}, connection_token:${connection_token}, refresh_token:${refresh_token}, expires:${expires}`)
        return await this.pool.query(DatabaseHelper.CREATE_UPDATE,
            [userId, connection_token, refresh_token, expires.toISOString()]).catch(logger.error)
    }

    async updateSpotifyKeyForUser(
        userId: string, connection_token: string, expires: Date): Promise<void> {
        logger.debug(`DatabaseHelper: update spotify key for user, userId:${userId}, connection_token:${connection_token}, expires:${expires}`)
        return await this.pool.query("UPDATE spotify_connections SET user_id = $1, connection_token = $2, expires = $3 WHERE user_id = $1",
            [userId, connection_token, expires.toISOString()])
    }

    async getAllUserIds(): Promise<UserID[]> {

        return (await this.pool.query(DatabaseHelper.GET_USERS).catch(logger.error)).rows
    }

    async deleteUser(userId: string) {
        return await this.pool.query(DatabaseHelper.DELETE_USERS, [userId]).catch(logger.error)
    }


}

