import * as jwt from 'jsonwebtoken'
import {Request, Response} from 'express'

export class JwtHelper {

    private static readonly jwtKey: string = "SUPER_SECRET_KEY"
    private static readonly jwtExpiry: number = 300

    static createBearerToken(bearerToken: string): any {
        return jwt.sign({bearerToken}, this.jwtKey, {
            algorithm: 'HS256',
            expiresIn: this.jwtExpiry
        })
    }

    static readBearerTokenFromRequest(req: Request): string {
        try {
            const token = jwt.verify(req.cookies.SESSION_ID, this.jwtKey)
            return token.bearerToken
        } catch (e) {
            if(e instanceof jwt.JsonWebTokenError) {
                console.log("Invalid JWT Token")
            } else {
            }
            return undefined
        }
    }

    static saveBearerTokenToCookie(res: Response, token: any) {
        res.cookie("SESSION_ID", token, { maxAge: this.jwtExpiry * 1000})
    }
}