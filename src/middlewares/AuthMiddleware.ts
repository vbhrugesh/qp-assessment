import { NextFunction, Request, Response } from "express"
import HttpStatusCode from "http-status-codes"
import { VerifyOptions } from "jsonwebtoken"
import { get } from "lodash"

import HttpException from "../exceptions/HttpException"
import AuthService from "../services/AuthService"
import UserService from "../services/UserService"
import JwtHelper from "../utils/JwtHelper"

// Use environment variable for the secret key

const JWTHelper = new JwtHelper()
const userService = new UserService()
const authService = new AuthService()

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const header: string | undefined = req.headers.authorization
        if (typeof header === "undefined") {
            throw new HttpException(
                HttpStatusCode.UNAUTHORIZED,
                "Un-authorized."
            )
        }
        const bearer = header.split(" ")
        const token = bearer[1]

        const verifyOptions = {
            algorithm: ["RS256"],
        } as VerifyOptions
        const { decoded } = JWTHelper.decode(token, verifyOptions)

        if (!decoded || !get(decoded, "id")) {
            throw new HttpException(HttpStatusCode.FORBIDDEN, "Un-authorized")
        }

        const userId = get(decoded, "id") || ""

        const user = await userService.findUser({ _id: userId })
        if (!user) {
            throw new HttpException(HttpStatusCode.FORBIDDEN, "Un-authorized")
        }
        const tokenObj = await authService.getTokenDetailsByUserId(
            userId as string
        )
        const userIpAddress =
            req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress

        if (tokenObj && userIpAddress !== tokenObj?.createdByIp) {
            throw new HttpException(HttpStatusCode.FORBIDDEN, "Un-authorized")
        }

        if (!req.user && user) {
            req.user = user as Express.User
        }
        next()
    } catch (error) {
        next(error)
    }
}

export default verifyToken
