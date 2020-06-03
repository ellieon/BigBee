import * as jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import * as logger from 'winston'
import { EnvironmentHelper } from 'common/environmentHelper'

export class JwtHelper {

  private static readonly jwtKey: string = EnvironmentHelper.getJWTSecret()
  private static readonly jwtExpiry: number = 3600

  static createBearerToken (bearerToken: string): any {
    return jwt.sign({ bearerToken }, this.jwtKey, {
      algorithm: 'HS256',
      expiresIn: this.jwtExpiry
    })
  }

  static readBearerTokenFromRequest (req: Request): string {
    try {
      const token = jwt.verify(req.cookies.SESSION_ID, this.jwtKey)
      return token.bearerToken
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        logger.info('Invalid JWT Token')
      }
      return undefined
    }
  }

  static saveBearerTokenToCookie (res: Response, token: any) {
    res.cookie('SESSION_ID', token, { maxAge: this.jwtExpiry * 1000 })
  }
}
