import {EnvironmentHelper as env} from "./environmentHelper";

const Pool = require('pg').Pool

export class SpotifyConnection{
    constructor(
        public connectionToken: string,
        public refreshToken: string,
        public expires: Date
    ) {
    }
}
export class DatabaseHelper {
    readonly pool = new Pool({
        connectionString: env.getDatabaseURL()
    })

    constructor() {
    }

    async getSpotifyKeyForUser(userId?: string): Promise<SpotifyConnection> {
        const res =
            await this.pool.query(
                "SELECT connection_token, refresh_token, expires FROM spotify_connections WHERE user_id=$1", ['1'])

        if(res.rows.length === 0) {
            return undefined
        } else {
            const row = res.rows[0];
            let expires: Date = new Date(row.expires)
            return new SpotifyConnection(row.connection_token, row.refresh_token, expires)
        }
    }


    async setCurrentSpotifyKey(
        userId: string, connection_token: string, refresh_token: string, expires: Date): Promise<void>{
        return await this.pool.query("UPDATE spotify_connections SET user_id = $1, connection_token = $2, refresh_token = $3, expires = $4 WHERE user_id = $1",
            ['1', connection_token, refresh_token, expires.toISOString()])
    }

    async updateSpotifyKeyForUser(
        userId: string, connection_token: string, expires: Date): Promise<void>{
        return await this.pool.query("UPDATE spotify_connections SET user_id = $1, connection_token = $2, expires = $3 WHERE user_id = $1",
            ['1', connection_token, expires.toISOString()])
    }



}

