import { EnvironmentHelper as env } from 'common/environmentHelper'
import * as logger from 'winston'

const Pool = require('pg').Pool

export class SpotifyConnection {
  constructor (
    public userId: string,
    public connectionToken: string,
    public refreshToken: string,
    public expires: Date
  ) {
  }
}

export class UserID {
  // tslint:disable-next-line:variable-name
  user_id: string
}

export class DatabaseHelper {

  private static readonly CREATE_UPDATE: string = `
    INSERT INTO spotify_connections VALUES ($1, $2, $3, $4
        ON CONFLICT (user_id) DO
        UPDATE SET connection_token = $2, refresh_token = $3, expires = $4
   `
  private static readonly GET_KEY: string =
      `SELECT connection_token, refresh_token, expires FROM spotify_connections WHERE user_id=$1`

  private static readonly GET_KEYS: string =
      `SELECT * FROM spotify_connections`
  private static readonly GET_USERS: string = `SELECT user_id FROM spotify_connections`
  private static readonly DELETE_USERS: string = `DELETE from spotify_connections WHERE user_id=$1`

  private static readonly UPDATE_SCOREBOARD = `
    INSERT INTO scoreboard VALUES ($1, 1)
        ON CONFLICT (user_id) DO
        UPDATE SET count = scoreboard.count + 1`

  private static readonly GET_SCOREBOARD: string =
      `SELECT * FROM scoreboard`

  private static readonly SET_BACKLOG: string =
      `insert into config (key, value) VALUES ('backlog', 'done')`

  private static readonly GET_BACKLOG: string =
      `SELECT * FROM config where key = 'backlog'`
  private static instance: DatabaseHelper

  readonly pool = new Pool({
    connectionString: env.getDatabaseURL()
  })

  private constructor () {
  }

  public static getInstance (): DatabaseHelper {
    if (!DatabaseHelper.instance) {
      DatabaseHelper.instance = new DatabaseHelper()
    }

    return DatabaseHelper.instance
  }

  async getAllSpotifyKeys (): Promise<Map<string, SpotifyConnection>> {
    logger.debug(`DatabaseHelper: get all spotify keys`)
    const results = await this.pool.query(DatabaseHelper.GET_KEYS).catch(logger.error)
    let connections = new Map<string, SpotifyConnection>()

    for (let row of results.rows) {
      connections.set(row.user_id,
        new SpotifyConnection(row.user_id, row.connection_token, row.refresh_token, new Date(row.expires)))
    }

    return connections
  }

  async getSpotifyKeyForUser (userId: string): Promise<SpotifyConnection> {
    logger.debug(`DatabaseHelper: get spotify key for ${userId}`)
    const res =
      await this.pool.query(
        DatabaseHelper.GET_KEY, [userId]).catch(logger.error)

    if (res.rows.length === 0) {
      logger.debug(`DatabaseHelper: found no user`)
      return undefined
    } else {
      logger.debug(`DatabaseHelper: found a user`)
      const row = res.rows[0]
      let expires: Date = new Date(row.expires)
      return new SpotifyConnection(row.user_id, row.connection_token, row.refresh_token, expires)
    }
  }

  async setCurrentSpotifyKey (
    userId: string, connectionToken: string, refreshToken: string, expires: Date): Promise<void> {
    logger.debug(`DatabaseHelper: set spotify key ${userId}, connection_token:${connectionToken}, refresh_token:${refreshToken}, expires:${expires}`)
    return this.pool.query(DatabaseHelper.CREATE_UPDATE,
      [userId, connectionToken, refreshToken, expires.toISOString()]).catch(logger.error)
  }

  async updateSpotifyKeyForUser (
    userId: string, connectionToken: string, expires: Date): Promise<void> {
    logger.debug(`DatabaseHelper: update spotify key for user, userId:${userId}, connection_token:${connectionToken}, expires:${expires}`)
    return this.pool.query('UPDATE spotify_connections SET user_id = $1, connection_token = $2, expires = $3 WHERE user_id = $1',
      [userId, connectionToken, expires.toISOString()])
  }

  async incrementScoreBoardForUser (userId: string) {
    logger.debug(`DatabaseHelper: update score for user, userId:${userId}`)
    return this.pool.query(DatabaseHelper.UPDATE_SCOREBOARD, [userId])
  }

  async markBacklogDone () {
    logger.debug(`Marking backlog done`)
    return this.pool.query(DatabaseHelper.SET_BACKLOG)
  }

  async isBacklogDone () {
    const results = await this.pool.query(DatabaseHelper.GET_BACKLOG)
    return results.rows.length === 1
  }

  async getScoreboardValues () {
    return (await this.pool.query(DatabaseHelper.GET_SCOREBOARD).catch(logger.error)).rows
  }

  async getAllUserIds (): Promise<UserID[]> {
    return (await this.pool.query(DatabaseHelper.GET_USERS).catch(logger.error)).rows
  }

  async deleteUser (userId: string) {
    return this.pool.query(DatabaseHelper.DELETE_USERS, [userId]).catch(logger.error)
  }

}
